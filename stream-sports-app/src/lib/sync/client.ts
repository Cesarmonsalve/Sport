"use client";

import type { StreamSportsState, SyncStatus } from "@/types";
import { getPersistedRoom, persistRoom, randomRoomId } from "./room";

const LS_PREFIX = "stream_sports_state_";
const BC_PREFIX = "stream_sports_";
const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";

function hashState(obj: object): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return String(Date.now());
  }
}

export type SyncSource = "mqtt" | "broadcast" | "storage" | "poll";

export interface SyncCallbacks {
  onState: (state: StreamSportsState, meta: { source: SyncSource }) => void;
  onStatus: (status: SyncStatus, detail?: string) => void;
}

export class StreamSportsSyncClient {
  room: string;
  isPanel: boolean;
  debounceMs: number;
  private callbacks: SyncCallbacks;
  private _lastAppliedTs = 0;
  private _lastHash = "";
  private _applying = false;
  private _publishTimer: ReturnType<typeof setTimeout> | null = null;
  private _pendingState: StreamSportsState | null = null;
  private _mqttClient: {
    connected?: boolean;
    subscribe: (t: string, o: object, cb: (e?: Error) => void) => void;
    publish: (t: string, m: string, o: object) => void;
    on: (e: string, cb: (...args: unknown[]) => void) => void;
    end: (force?: boolean) => void;
  } | null = null;
  private _bc: BroadcastChannel | null = null;
  private _lsPoll: ReturnType<typeof setInterval> | null = null;
  private _destroyed = false;
  private _status: SyncStatus = "offline";
  private _syncClearTimer: ReturnType<typeof setTimeout> | null = null;
  readonly _mqttTopic: string;

  constructor(room: string, isPanel: boolean, callbacks: SyncCallbacks, debounceMs = 100) {
    this.room = room || getPersistedRoom() || randomRoomId();
    persistRoom(this.room);
    this.isPanel = isPanel;
    this.callbacks = callbacks;
    this.debounceMs = debounceMs;
    this._mqttTopic = `streamsports/${this.room}/state`;
  }

  get status(): SyncStatus {
    return this._status;
  }

  private setStatus(status: SyncStatus, detail?: string) {
    if (this._status === status && !detail) return;
    this._status = status;
    this.callbacks.onStatus(status, detail);
  }

  private applyIncoming(state: StreamSportsState, source: SyncSource) {
    if (!state || typeof state !== "object") return;
    const ts = state.ts || 0;
    const h = hashState(state);
    if (h === this._lastHash && ts <= this._lastAppliedTs) return;
    if (ts < this._lastAppliedTs) return;

    this._applying = true;
    this._lastAppliedTs = ts;
    this._lastHash = h;
    try {
      this.callbacks.onState(state, { source });
    } finally {
      this._applying = false;
    }
    this.setStatus("syncing", source);
    if (this._syncClearTimer) clearTimeout(this._syncClearTimer);
    this._syncClearTimer = setTimeout(() => {
      if (!this._destroyed) {
        this.setStatus(this._mqttClient?.connected ? "connected" : "local");
      }
    }, 400);
  }

  private broadcastLocal(state: StreamSportsState) {
    const payload = JSON.stringify(state);
    try {
      localStorage.setItem(LS_PREFIX + this.room, payload);
    } catch {
      /* ignore */
    }
    try {
      this._bc?.postMessage(state);
    } catch {
      /* ignore */
    }
  }

  private handleRaw(raw: unknown, source: SyncSource) {
    let state = raw;
    if (typeof raw === "string") {
      try {
        state = JSON.parse(raw);
      } catch {
        return;
      }
    }
    this.applyIncoming(state as StreamSportsState, source);
  }

  async connect() {
    if (this._destroyed) return;

    try {
      this._bc = new BroadcastChannel(BC_PREFIX + this.room);
      this._bc.onmessage = (ev) => this.handleRaw(ev.data, "broadcast");
    } catch {
      this._bc = null;
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", (ev) => {
        if (ev.key === LS_PREFIX + this.room && ev.newValue) {
          this.handleRaw(ev.newValue, "storage");
        }
      });
    }

    this._lsPoll = setInterval(() => {
      try {
        const raw = localStorage.getItem(LS_PREFIX + this.room);
        if (raw) this.handleRaw(raw, "poll");
      } catch {
        /* ignore */
      }
    }, 300);

    this.setStatus("connecting", "MQTT");

    try {
      const mqtt = await import("mqtt");
      this._mqttClient = mqtt.connect(MQTT_BROKER, {
        clientId: `ss_${this.room}_${Math.random().toString(16).slice(2, 10)}`,
        clean: true,
        reconnectPeriod: 3000,
        connectTimeout: 10000,
      }) as typeof this._mqttClient;

      this._mqttClient?.on("connect", () => {
        this.setStatus("connected", "MQTT");
        this._mqttClient?.subscribe(this._mqttTopic, { qos: 1 }, () => {});
      });
      this._mqttClient?.on("reconnect", () => this.setStatus("connecting", "MQTT"));
      this._mqttClient?.on("close", () => this.setStatus("offline", "MQTT"));
      this._mqttClient?.on("message", (topic: unknown, buf: unknown) => {
        if (topic !== this._mqttTopic) return;
        const raw = (buf as { toString: () => string }).toString();
        this.handleRaw(raw, "mqtt");
      });
    } catch (err) {
      console.warn("[StreamSportsSync] MQTT unavailable:", err);
      this.setStatus("local", "sin MQTT");
    }
  }

  publish(state: StreamSportsState) {
    if (this._destroyed || this._applying || !this.isPanel) return;
    const payload = { ...state, ts: Date.now(), room: this.room };
    const h = hashState(payload);
    if (h === this._lastHash) return;
    this._pendingState = payload;
    if (this._publishTimer) clearTimeout(this._publishTimer);
    this._publishTimer = setTimeout(() => this.flushPublish(), this.debounceMs);
  }

  publishNow(state: StreamSportsState) {
    if (this._publishTimer) clearTimeout(this._publishTimer);
    this._pendingState = { ...state, ts: Date.now(), room: this.room };
    this.flushPublish();
  }

  private flushPublish() {
    const state = this._pendingState;
    if (!state || this._destroyed) return;
    this._pendingState = null;
    this._lastHash = hashState(state);
    this._lastAppliedTs = state.ts ?? Date.now();
    this.broadcastLocal(state);
    if (this._mqttClient?.connected) {
      try {
        this._mqttClient.publish(this._mqttTopic, JSON.stringify(state), {
          qos: 1,
          retain: false,
        });
      } catch (e) {
        console.warn("[StreamSportsSync] publish error", e);
      }
    }
    this.setStatus("connected", "publicado");
  }

  destroy() {
    this._destroyed = true;
    if (this._publishTimer) clearTimeout(this._publishTimer);
    if (this._syncClearTimer) clearTimeout(this._syncClearTimer);
    if (this._lsPoll) clearInterval(this._lsPoll);
    try {
      this._bc?.close();
    } catch {
      /* ignore */
    }
    try {
      this._mqttClient?.end(true);
    } catch {
      /* ignore */
    }
    this._mqttClient = null;
    this._bc = null;
  }
}

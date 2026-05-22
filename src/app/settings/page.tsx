"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loadAppSettings,
  saveAppSettings,
  type AppSettings,
} from "@/lib/settings/app-settings";
import {
  getPersistedRoom,
  persistRoom,
  randomRoomId,
} from "@/lib/sync/room";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandKitPanel } from "@/components/editor/brand-kit-panel";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [room, setRoom] = useState("");

  useEffect(() => {
    setSettings(loadAppSettings());
    setRoom(getPersistedRoom() || randomRoomId());
  }, []);

  if (!settings) return null;

  const patch = (p: Partial<AppSettings>) => {
    const next = saveAppSettings(p);
    setSettings(next);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="mx-auto flex max-w-lg items-center justify-between px-6 py-5 border-b border-zinc-800">
        <Link href="/" className="text-sm font-medium text-zinc-100 hover:text-white">
          Stream Sports
        </Link>
        <Link href="/editor/nba" className="text-xs text-muted-foreground hover:text-foreground">
          Editor
        </Link>
      </nav>
      <main className="mx-auto max-w-lg px-6 pb-16 space-y-8">
        <h1 className="text-2xl font-semibold">Ajustes</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="brand">Marca</TabsTrigger>
          </TabsList>
          <TabsContent value="brand" className="mt-6">
            <BrandKitPanel />
          </TabsContent>
          <TabsContent value="general" className="mt-6 space-y-8">
        <section className="space-y-3">
          <Label htmlFor="room">Room ID (MQTT + overlays)</Label>
          <div className="flex gap-2">
            <Input
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase())}
              className="font-mono"
            />
            <Button
              variant="outline"
              onClick={() => {
                persistRoom(room);
              }}
            >
              Guardar
            </Button>
            <Button variant="ghost" onClick={() => setRoom(randomRoomId())}>
              Nuevo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Mismo room en editor y todas las fuentes OBS (?room=).
          </p>
        </section>

        <section className="space-y-3">
          <Label>Polling ESPN — partido en vivo (ms)</Label>
          <Input
            type="number"
            min={5000}
            step={1000}
            value={settings.pollIntervalLiveMs}
            onChange={(e) =>
              patch({ pollIntervalLiveMs: Math.max(5000, Number(e.target.value) || 12000) })
            }
          />
          <Label>Polling ESPN — inactivo (ms)</Label>
          <Input
            type="number"
            min={10000}
            step={1000}
            value={settings.pollIntervalIdleMs}
            onChange={(e) =>
              patch({ pollIntervalIdleMs: Math.max(10000, Number(e.target.value) || 30000) })
            }
          />
        </section>

        <section className="space-y-3">
          <Label htmlFor="mqtt">MQTT broker (opcional, futuro)</Label>
          <Input
            id="mqtt"
            placeholder="wss://…"
            value={settings.mqttBrokerUrl ?? ""}
            onChange={(e) => patch({ mqttBrokerUrl: e.target.value || undefined })}
          />
        </section>

        <Button
          variant="outline"
          onClick={() => {
            patch({ onboardingDone: false });
            alert("Recarga el editor para ver el tour de nuevo.");
          }}
        >
          Mostrar onboarding otra vez
        </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

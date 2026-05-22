"use client";

const KEY = "stream_sports_settings";

export interface AppSettings {
  pollIntervalLiveMs: number;
  pollIntervalIdleMs: number;
  onboardingDone: boolean;
  mqttBrokerUrl?: string;
}

const DEFAULTS: AppSettings = {
  pollIntervalLiveMs: 12_000,
  pollIntervalIdleMs: 30_000,
  onboardingDone: false,
};

export function loadAppSettings(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAppSettings(patch: Partial<AppSettings>) {
  const next = { ...loadAppSettings(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

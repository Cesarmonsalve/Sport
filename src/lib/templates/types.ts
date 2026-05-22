import type { ElementStyle, Sport } from "@/types";

export interface StreamTemplate {
  id: string;
  name: string;
  sport: Sport;
  description: string;
  theme: {
    accentHome: string;
    accentAway: string;
    accentGold?: string;
  };
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  visibility: Record<string, boolean>;
}

export interface SavedStreamerTemplate extends StreamTemplate {
  savedAt: string;
  room?: string;
}

import type { Sport } from "@/types";
import type { StreamTemplate } from "@/lib/templates/types";
import { BROADCAST_MLB, BROADCAST_NBA } from "@/lib/templates/broadcast-classic";
import { STREAMER_FIELD_NBA } from "@/lib/templates/streamer-field-nba";
import { STREAMER_FIELD_MLB } from "@/lib/templates/streamer-field-mlb";

export const BUILTIN_TEMPLATES: StreamTemplate[] = [
  BROADCAST_NBA,
  STREAMER_FIELD_NBA,
  BROADCAST_MLB,
  STREAMER_FIELD_MLB,
];

export function getTemplatesForSport(sport: Sport): StreamTemplate[] {
  return BUILTIN_TEMPLATES.filter((t) => t.sport === sport);
}

export function getTemplateById(sport: Sport, id: string): StreamTemplate | undefined {
  return getTemplatesForSport(sport).find((t) => t.id === id);
}

export { applyTemplate } from "@/lib/templates/apply";

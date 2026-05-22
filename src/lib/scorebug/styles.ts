import type { ScorebugStyle } from "@/types";
import { cn } from "@/lib/utils";

const STYLE_CLASS: Record<ScorebugStyle, string> = {
  broadcast: "scorebug-broadcast",
  glass: "scorebug-glass",
  industrial: "scorebug-industrial",
  retro: "scorebug-retro",
  minimal: "scorebug-minimal",
  esports: "scorebug-esports",
};

export function scorebugClassName(style: ScorebugStyle = "broadcast", extra?: string) {
  return cn(STYLE_CLASS[style], extra);
}

export const SCOREBUG_STYLE_OPTIONS: { value: ScorebugStyle; label: string }[] = [
  { value: "broadcast", label: "Broadcast" },
  { value: "glass", label: "Glass" },
  { value: "industrial", label: "Industrial" },
  { value: "retro", label: "Retro" },
  { value: "minimal", label: "Minimal" },
  { value: "esports", label: "Esports" },
];

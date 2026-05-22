import type { Sport, StreamSportsState } from "@/types";

export interface ThemeExport {
  version: 1;
  name: string;
  exportedAt: string;
  sport: Sport;
  templateId?: string;
  templateName?: string;
  positions: StreamSportsState["positions"];
  elements: StreamSportsState["elements"];
  visibility: StreamSportsState["visibility"];
  textOverrides?: Record<string, string>;
  zIndex?: Record<string, number>;
  playerSlots?: StreamSportsState["playerSlots"];
}

export function buildThemeExport(
  state: StreamSportsState,
  name: string,
  extras?: {
    textOverrides?: Record<string, string>;
    zIndex?: Record<string, number>;
    playerSlots?: StreamSportsState["playerSlots"];
  }
): ThemeExport {
  return {
    version: 1,
    name,
    exportedAt: new Date().toISOString(),
    sport: state.sport,
    templateId: state.templateId,
    templateName: state.templateName,
    positions: state.positions,
    elements: state.elements,
    visibility: state.visibility,
    textOverrides: extras?.textOverrides,
    zIndex: extras?.zIndex,
    playerSlots: extras?.playerSlots ?? state.playerSlots,
  };
}

export function downloadThemeJson(theme: ThemeExport) {
  const blob = new Blob([JSON.stringify(theme, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `stream-sports-${theme.sport}-${theme.name.replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function parseThemeFile(json: unknown): ThemeExport | null {
  if (!json || typeof json !== "object") return null;
  const t = json as ThemeExport;
  if (t.version !== 1 || !t.sport || !t.positions) return null;
  return t;
}

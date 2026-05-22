import type { StreamSportsState } from "@/types";
import { parseThemeFile, type ThemeExport } from "@/lib/theme/io";

export interface ProjectExport extends StreamSportsState {
  kind: "stream-sports-project";
  name: string;
  exportedAt: string;
}

export function buildProjectExport(state: StreamSportsState, name: string): ProjectExport {
  return {
    kind: "stream-sports-project",
    name,
    exportedAt: new Date().toISOString(),
    ...state,
  };
}

export function downloadProjectJson(project: ProjectExport) {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `stream-sports-project-${project.sport}-${project.name.replace(/\s+/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function parseProjectFile(json: unknown): ProjectExport | null {
  if (!json || typeof json !== "object") return null;
  const o = json as ProjectExport & ThemeExport;
  if (o.kind === "stream-sports-project" && o.version === 1 && o.sport && o.positions) {
    return o as ProjectExport;
  }
  const theme = parseThemeFile(json);
  if (!theme) return null;
  return {
    kind: "stream-sports-project",
    name: theme.name,
    exportedAt: theme.exportedAt,
    version: 1,
    sport: theme.sport,
    room: "",
    designMode: false,
    freeEditMode: theme.freeEditMode ?? true,
    moveAsBlock: theme.moveAsBlock ?? false,
    groupMode: false,
    editorMode: "advanced",
    templateId: theme.templateId,
    templateName: theme.templateName,
    visibility: theme.visibility,
    positions: theme.positions,
    elements: theme.elements,
    textOverrides: theme.textOverrides,
    zIndex: theme.zIndex,
    playerSlots: theme.playerSlots,
    dataBindings: theme.dataBindings,
    userTouchedElements: theme.userTouchedElements,
  };
}

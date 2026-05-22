import { getTemplateById } from "@/lib/templates";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { ElementStyle, Sport } from "@/types";

export function factoryPositions(sport: Sport): Record<string, { left: string; top: string }> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, { left: string; top: string }> = {};
  Object.values(reg).forEach((e) => {
    if (e.defaults?.left != null || e.defaults?.top != null) {
      out[e.id] = { left: e.defaults.left ?? "0", top: e.defaults.top ?? "0" };
    }
  });
  return out;
}

export function factoryElements(sport: Sport): Record<string, ElementStyle> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, ElementStyle> = {};
  Object.values(reg).forEach((e) => {
    if (!e.defaults) return;
    const style: ElementStyle = { ...e.defaults };
    delete style.left;
    delete style.top;
    if (Object.keys(style).length) out[e.id] = style;
  });
  return out;
}

export function factoryVisibility(sport: Sport): Record<string, boolean> {
  const reg = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const out: Record<string, boolean> = {};
  Object.keys(reg).forEach((id) => {
    out[id] =
      id.includes("scorebug") ||
      id.includes("scoreboard") ||
      id.startsWith("sb-") ||
      id.startsWith("score-");
  });
  if (sport === "nba") {
    out["nba-scorebug"] = true;
    out["card-jugador"] = false;
    out["quinteto-widget"] = false;
    out["destacado-widget"] = false;
    out["fouls-v"] = true;
    out["fouls-h"] = true;
    out["shot-clock"] = true;
  }
  if (sport === "mlb") {
    out.scoreboard = true;
    out["line-score"] = false;
    out["bases-widget"] = false;
    out["matchup-widget"] = false;
    out["roster-widget"] = false;
    out["play-ticker"] = false;
  }
  return out;
}

/** Posiciones/estilos/visibilidad de plantilla activa o factory registry */
export function resolveLayoutDefaults(sport: Sport, templateId: string) {
  const tpl = getTemplateById(sport, templateId);
  const positions = factoryPositions(sport);
  const elements = factoryElements(sport);
  const visibility = factoryVisibility(sport);

  if (tpl) {
    Object.assign(positions, tpl.positions);
    for (const [id, st] of Object.entries(tpl.elements)) {
      elements[id] = { ...elements[id], ...st };
    }
    Object.assign(visibility, tpl.visibility);
  }

  return { positions, elements, visibility };
}

export function isFreeLayoutId(id: string) {
  return (
    id.startsWith("free-") ||
    id.startsWith("dropped-photo-") ||
    id.includes("-copy-")
  );
}

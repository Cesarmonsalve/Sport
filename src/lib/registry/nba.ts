import type { RegistryEntry } from "@/types";

const entry = (
  id: string,
  label: string,
  category: string,
  opts?: Partial<RegistryEntry>
): RegistryEntry => ({
  id,
  label,
  category,
  defaults: {},
  ...opts,
});

export const NBA_REGISTRY: Record<string, RegistryEntry> = {
  "nba-scorebug": entry("nba-scorebug", "Marcador (scorebug)", "Marcador", {
    compound: true,
    children: [
      "score-local",
      "score-visitante",
      "tiempo-cuarto",
      "shot-clock",
      "fouls-v",
      "fouls-h",
      "bonus-v",
      "bonus-h",
      "team-logo-v",
      "team-logo-h",
    ],
    defaults: { left: "20px", top: "12px" },
  }),
  "score-local": entry("score-local", "Puntos local", "Marcador · dígitos", {
    parent: "nba-scorebug",
    defaults: { fontSize: "96px", fontFamily: "Bebas Neue", color: "#00b8d4", left: "0", top: "0" },
  }),
  "score-visitante": entry("score-visitante", "Puntos visitante", "Marcador · dígitos", {
    parent: "nba-scorebug",
    defaults: { fontSize: "96px", fontFamily: "Bebas Neue", color: "#e11d48", left: "140px", top: "0" },
  }),
  "tiempo-cuarto": entry("tiempo-cuarto", "Reloj / cuarto", "Marcador · reloj", {
    parent: "nba-scorebug",
    defaults: { fontSize: "28px", fontFamily: "Rajdhani", color: "#e8eaef", left: "280px", top: "8px" },
  }),
  "shot-clock": entry("shot-clock", "Shot clock", "Marcador · situación", {
    parent: "nba-scorebug",
    defaults: { fontSize: "36px", fontFamily: "Bebas Neue", color: "#fbbf24", left: "280px", top: "48px" },
  }),
  "fouls-v": entry("fouls-v", "Faltas visitante", "Marcador · situación", {
    parent: "nba-scorebug",
    defaults: { fontSize: "14px", fontFamily: "Rajdhani", left: "140px", top: "100px" },
  }),
  "fouls-h": entry("fouls-h", "Faltas local", "Marcador · situación", {
    parent: "nba-scorebug",
    defaults: { fontSize: "14px", fontFamily: "Rajdhani", left: "0", top: "100px" },
  }),
  "bonus-v": entry("bonus-v", "Bonus visitante", "Marcador · situación", { parent: "nba-scorebug" }),
  "bonus-h": entry("bonus-h", "Bonus local", "Marcador · situación", { parent: "nba-scorebug" }),
  "team-logo-v": entry("team-logo-v", "Logo visitante", "Marcador · equipos", {
    parent: "nba-scorebug",
    defaults: { left: "0", top: "-56px" },
  }),
  "team-logo-h": entry("team-logo-h", "Logo local", "Marcador · equipos", {
    parent: "nba-scorebug",
    defaults: { left: "240px", top: "-56px" },
  }),
  "card-jugador": entry("card-jugador", "Tarjeta jugador", "Tarjetas", {
    compound: true,
    children: ["card-nombre-text", "card-stats"],
    defaults: { left: "48px", top: "720px", width: "520px" },
  }),
  "quinteto-widget": entry("quinteto-widget", "Quinteto en cancha", "Quinteto", {
    compound: true,
    defaults: { left: "48px", top: "400px" },
  }),
  "destacado-widget": entry("destacado-widget", "Jugador destacado", "Tarjetas", {
    compound: true,
    defaults: { left: "1200px", top: "720px" },
  }),
};

export const NBA_PRESETS = {
  broadcast: {
    label: "Broadcast TV",
    map: {
      "score-local": { fontSize: "108px" },
      "score-visitante": { fontSize: "108px" },
      "tiempo-cuarto": { fontSize: "32px" },
    },
  },
  compact: {
    label: "Compacto",
    map: {
      "score-local": { fontSize: "72px" },
      "score-visitante": { fontSize: "72px" },
    },
  },
  minimal: {
    label: "Minimal",
    map: {
      "score-local": { fontSize: "64px", opacity: "0.95" },
      "score-visitante": { fontSize: "64px", opacity: "0.95" },
    },
  },
} as const;

import type { StreamTemplate } from "@/lib/templates/types";

export const BROADCAST_NBA: StreamTemplate = {
  id: "broadcast-classic",
  name: "Broadcast clásico",
  sport: "nba",
  description: "Scorebug superior, widgets compactos",
  theme: { accentHome: "#00b8d4", accentAway: "#e11d48" },
  positions: {
    "nba-scorebug": { left: "20px", top: "12px" },
    "quinteto-widget": { left: "48px", top: "400px" },
    "card-jugador": { left: "48px", top: "720px" },
    "destacado-widget": { left: "1200px", top: "720px" },
  },
  elements: {},
  visibility: {
    "nba-scorebug": true,
    "quinteto-widget": false,
    "card-jugador": false,
    "destacado-widget": false,
    "court-positions-widget": false,
    "webcam-panel": false,
    "social-footer": false,
  },
};

export const BROADCAST_MLB: StreamTemplate = {
  id: "broadcast-classic",
  name: "Broadcast clásico",
  sport: "mlb",
  description: "Marcador superior estándar",
  theme: { accentHome: "#00b8d4", accentAway: "#ff7a00", accentGold: "#c9a227" },
  positions: {
    scoreboard: { left: "24px", top: "16px" },
    "line-score": { left: "24px", top: "120px" },
    "bases-widget": { left: "1400px", top: "880px" },
    "matchup-widget": { left: "400px", top: "780px" },
    "roster-widget": { left: "1400px", top: "200px" },
    "play-ticker": { left: "24px", top: "980px" },
  },
  elements: {},
  visibility: {
    scoreboard: true,
    "line-score": false,
    "bases-widget": false,
    "matchup-widget": false,
    "roster-widget": false,
    "play-ticker": false,
    "field-positions-widget": false,
    "webcam-main": false,
    "webcam-secondary": false,
  },
};

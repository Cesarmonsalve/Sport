import type { Sport } from "@/types";

export interface BroadcastScene {
  id: string;
  label: string;
  description: string;
  sport: Sport;
  templateId: string;
  /** widget id -> visible */
  visibility: Record<string, boolean>;
}

const NBA_SCENES: BroadcastScene[] = [
  {
    id: "nba-scorebug-only",
    label: "Solo marcador",
    description: "Scorebug + logos ESPN",
    sport: "nba",
    templateId: "broadcast-classic",
    visibility: {
      "nba-scorebug": true,
      "team-logo-home": true,
      "team-logo-away": true,
      "quinteto-widget": false,
      "court-positions-widget": false,
      "card-jugador": false,
      "destacado-widget": false,
      "webcam-panel": false,
      "social-footer": false,
      "sponsor-ticker": false,
    },
  },
  {
    id: "nba-broadcast-full",
    label: "Broadcast completo",
    description: "Marcador + quinteto + cancha",
    sport: "nba",
    templateId: "broadcast-classic",
    visibility: {
      "nba-scorebug": true,
      "team-logo-home": true,
      "team-logo-away": true,
      "quinteto-widget": true,
      "court-positions-widget": true,
      "card-jugador": false,
      "destacado-widget": true,
      "webcam-panel": false,
      "social-footer": true,
      "sponsor-ticker": true,
    },
  },
  {
    id: "nba-streamer-field",
    label: "Streamer campo",
    description: "Layout campo + webcam",
    sport: "nba",
    templateId: "streamer-field-nba",
    visibility: {
      "nba-scorebug": true,
      "quinteto-widget": true,
      "court-positions-widget": true,
      "webcam-panel": true,
      "social-footer": true,
      "sponsor-ticker": true,
      "team-logo-home": true,
      "team-logo-away": true,
    },
  },
];

const MLB_SCENES: BroadcastScene[] = [
  {
    id: "mlb-scoreboard-only",
    label: "Solo marcador",
    sport: "mlb",
    templateId: "broadcast-classic",
    description: "Marcador superior",
    visibility: {
      scoreboard: true,
      "team-logo-home": true,
      "team-logo-away": true,
      "line-score": false,
      "bases-widget": false,
      "matchup-widget": false,
      "field-positions-widget": false,
      "roster-widget": false,
      "play-ticker": false,
      "sponsor-ticker": false,
    },
  },
  {
    id: "mlb-broadcast-full",
    label: "Broadcast completo",
    sport: "mlb",
    templateId: "broadcast-classic",
    description: "Marcador + bases + matchup + ticker",
    visibility: {
      scoreboard: true,
      "line-score": true,
      "bases-widget": true,
      "matchup-widget": true,
      "play-ticker": true,
      "team-logo-home": true,
      "team-logo-away": true,
      "sponsor-ticker": true,
      "field-positions-widget": false,
      "roster-widget": false,
    },
  },
  {
    id: "mlb-streamer-field",
    label: "Streamer campo",
    sport: "mlb",
    templateId: "streamer-field-mlb",
    description: "Campo + marcador + webcam",
    visibility: {
      scoreboard: true,
      "field-positions-widget": true,
      "webcam-main": true,
      "bases-widget": true,
      "matchup-widget": true,
      "sponsor-ticker": true,
      "team-logo-home": true,
      "team-logo-away": true,
    },
  },
];

export function getScenesForSport(sport: Sport): BroadcastScene[] {
  return sport === "nba" ? NBA_SCENES : MLB_SCENES;
}

export function getSceneById(sport: Sport, sceneId: string): BroadcastScene | undefined {
  return getScenesForSport(sport).find((s) => s.id === sceneId);
}

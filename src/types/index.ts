export type Sport = "nba" | "mlb";

export type EditorMode = "simple" | "advanced";

export type ElementStyle = Partial<{
  left: string;
  top: string;
  fontSize: string;
  fontFamily: string;
  color: string;
  opacity: string;
  width: string;
  height: string;
  backgroundColor: string;
  textShadow: string;
  borderRadius: string;
}>;

export interface StreamSportsState {
  version: 1;
  sport: Sport;
  room: string;
  eventId?: string;
  designMode: boolean;
  groupMode: boolean;
  editorMode: EditorMode;
  visibility: Record<string, boolean>;
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  game?: NbaGameSnapshot | MlbGameSnapshot;
  ts?: number;
}

export interface NbaGameSnapshot {
  scoreHome: number;
  scoreAway: number;
  period: string;
  clock: string;
  shotClock?: string;
  homeAbbr: string;
  awayAbbr: string;
  homeLogo?: string;
  awayLogo?: string;
}

export interface MlbGameSnapshot {
  scoreHome: number;
  scoreAway: number;
  inning: string;
  inningHalf: string;
  homeAbbr: string;
  awayAbbr: string;
}

export interface RegistryEntry {
  id: string;
  label: string;
  category: string;
  parent?: string;
  children?: string[];
  compound?: boolean;
  defaults?: ElementStyle;
}

export type SyncStatus =
  | "offline"
  | "connecting"
  | "connected"
  | "local"
  | "syncing";

export type Sport = "nba" | "mlb";

export type EditorMode = "simple" | "advanced";

export type WidgetAnimation = "none" | "fade" | "slide";

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
  borderColor: string;
  animation: WidgetAnimation;
  zIndex: string;
  rotate: string;
  imageUrl: string;
}>;

/** Maps ESPN athlete to a fixed UI slot without moving layout */
export interface PlayerSlotBinding {
  slotId: string;
  athleteId?: string;
  team: "home" | "away";
  slotIndex: number;
  position?: string;
}

export interface StreamSportsState {
  version: 1;
  sport: Sport;
  room: string;
  eventId?: string;
  designMode: boolean;
  groupMode: boolean;
  editorMode: EditorMode;
  templateId?: string;
  templateName?: string;
  visibility: Record<string, boolean>;
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  textOverrides?: Record<string, string>;
  zIndex?: Record<string, number>;
  playerSlots?: Record<string, PlayerSlotBinding>;
  game?: NbaGameSnapshot | MlbGameSnapshot;
  ts?: number;
}

export interface NbaPlayer {
  id: string;
  name: string;
  jersey?: string;
  headshot?: string;
  position?: string;
  points?: number;
  rebounds?: number;
  assists?: number;
}

export interface NbaRotationEvent {
  team: "home" | "away";
  playerIn: NbaPlayer;
  playerOut?: NbaPlayer;
  ts: number;
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
  foulsHome?: number;
  foulsAway?: number;
  bonusHome?: boolean;
  bonusAway?: boolean;
  featuredPlayer?: NbaPlayer;
  onCourtHome?: NbaPlayer[];
  onCourtAway?: NbaPlayer[];
  lastRotation?: NbaRotationEvent;
}

export interface MlbLineScore {
  away: number[];
  home: number[];
  inningLabels: string[];
}

export interface MlbPlayer {
  id: string;
  name: string;
  jersey?: string;
  headshot?: string;
  position?: string;
  avg?: string;
}

export interface MlbPlayItem {
  text: string;
  inning?: string;
}

export interface MlbGameSnapshot {
  scoreHome: number;
  scoreAway: number;
  inning: string;
  inningHalf: string;
  homeAbbr: string;
  awayAbbr: string;
  homeLogo?: string;
  awayLogo?: string;
  linescore?: MlbLineScore;
  balls?: number;
  strikes?: number;
  outs?: number;
  bases?: { first: boolean; second: boolean; third: boolean };
  pitcher?: MlbPlayer;
  batter?: MlbPlayer;
  rosterAway?: MlbPlayer[];
  rosterHome?: MlbPlayer[];
  lastPlays?: MlbPlayItem[];
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

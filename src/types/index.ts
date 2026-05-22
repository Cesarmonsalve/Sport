export type Sport = "nba" | "mlb";

export type EditorMode = "simple" | "advanced";

export type WidgetAnimation = "none" | "fade" | "slide";

export type DataSource = "espn" | "manual";

/** @deprecated use lineupPreset + show* flags */
export type LineupDisplayMode =
  | "text-only"
  | "photo-text"
  | "photo-stats"
  | "text-stats"
  | "full"
  | "photo-only";

export type LineupPreset = "text-only" | "name-photo" | "name-stats" | "full";

export type MarkerStyle = "photo" | "initials" | "dot" | "name";

export interface WidgetDisplaySettings {
  lineupPreset?: LineupPreset;
  /** @deprecated */ lineupDisplayMode?: LineupDisplayMode;
  showPhoto?: boolean;
  showStats?: boolean;
  showName?: boolean;
  markerStyle?: MarkerStyle;
  markerShowPhoto?: boolean;
  /** Rotating sponsor lines for sponsor-ticker widget */
  sponsorLines?: string[];
}

export type FreeElementType =
  | "dropped-player-photo"
  | "free-image"
  | "free-text"
  | "free-rect";

export interface FreeCanvasElement {
  id: string;
  type: FreeElementType;
  left: string;
  top: string;
  width?: string;
  height?: string;
  imageUrl?: string;
  label?: string;
  text?: string;
  fontSize?: string;
  backgroundColor?: string;
  athleteId?: string;
}

export interface GalleryPlayer {
  id: string;
  name: string;
  jersey?: string;
  headshot?: string;
  team: "home" | "away";
  teamAbbr: string;
  position?: string;
  points?: number;
  rebounds?: number;
  assists?: number;
  avg?: string;
}

export type ElementStyle = Partial<{
  left: string;
  top: string;
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  textAlign: string;
  color: string;
  opacity: string;
  backgroundColor: string;
  textShadow: string;
  boxShadow: string;
  borderRadius: string;
  borderColor: string;
  borderWidth: string;
  padding: string;
  margin: string;
  gap: string;
  animation: WidgetAnimation;
  zIndex: string;
  rotate: string;
  imageUrl: string;
  objectFit: string;
  accentColor: string;
}>;

export interface ElementDataBinding {
  dataSource: DataSource;
  manualText?: string;
  manualImageUrl?: string;
  espnField?: string;
  athleteId?: string;
  displayLabel?: string;
}

export interface PlayerSlotBinding {
  slotId: string;
  athleteId?: string;
  team: "home" | "away";
  slotIndex: number;
  position?: string;
  dataSource?: DataSource;
  manualName?: string;
  manualImageUrl?: string;
}

export interface StreamSportsState {
  version: 1;
  sport: Sport;
  room: string;
  eventId?: string;
  designMode: boolean;
  freeEditMode: boolean;
  moveAsBlock: boolean;
  groupMode: boolean;
  editorMode: EditorMode;
  templateId?: string;
  templateName?: string;
  visibility: Record<string, boolean>;
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  textOverrides?: Record<string, string>;
  dataBindings?: Record<string, ElementDataBinding>;
  zIndex?: Record<string, number>;
  playerSlots?: Record<string, PlayerSlotBinding>;
  userTouchedElements?: string[];
  widgetSettings?: Record<string, WidgetDisplaySettings>;
  confettiEnabled?: boolean;
  galleryPlayers?: GalleryPlayer[];
  freeElements?: FreeCanvasElement[];
  streamSafePreview?: boolean;
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
  homeLogoOverride?: string;
  awayLogoOverride?: string;
  foulsHome?: number;
  foulsAway?: number;
  bonusHome?: boolean;
  bonusAway?: boolean;
  featuredPlayer?: NbaPlayer;
  onCourtHome?: NbaPlayer[];
  onCourtAway?: NbaPlayer[];
  lastRotation?: NbaRotationEvent;
  /** ESPN situation.possession — home | away */
  possession?: "home" | "away";
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
  homeLogoOverride?: string;
  awayLogoOverride?: string;
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
  atom?: boolean;
  defaults?: ElementStyle;
}

export type SyncStatus =
  | "offline"
  | "connecting"
  | "connected"
  | "local"
  | "syncing";

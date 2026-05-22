/** ESPN Site API — shared shapes (partial, defensive parsing) */

export interface EspnTeamRef {
  id?: string;
  abbreviation?: string;
  displayName?: string;
  logo?: string;
}

export interface EspnAthlete {
  id?: string;
  displayName?: string;
  shortName?: string;
  jersey?: string;
  position?: { abbreviation?: string; displayName?: string };
  headshot?: { href?: string };
  onCourt?: boolean;
}

export interface EspnCompetitor {
  homeAway?: "home" | "away";
  score?: string;
  team?: EspnTeamRef;
  linescores?: { value?: number; displayValue?: string }[];
  statistics?: { name?: string; displayValue?: string; value?: number }[];
}

export interface EspnCompetition {
  competitors?: EspnCompetitor[];
  status?: {
    displayClock?: string;
    period?: number;
    type?: { description?: string; state?: string; shortDetail?: string };
  };
  situation?: EspnSituation;
}

export interface EspnSituation {
  displayClock?: string;
  period?: number;
  shotClock?: string;
  homeTimeouts?: number;
  awayTimeouts?: number;
  possession?: string;
  lastPlay?: { text?: string };
  balls?: number;
  strikes?: number;
  outs?: number;
  onFirst?: boolean;
  onSecond?: boolean;
  onThird?: boolean;
  batter?: EspnAthlete;
  pitcher?: EspnAthlete;
}

export interface EspnEvent {
  id?: string;
  name?: string;
  shortName?: string;
  status?: { type?: { description?: string; state?: string } };
  competitions?: EspnCompetition[];
}

export interface EspnScoreboardResponse {
  events?: EspnEvent[];
}

export interface EspnBoxscoreAthlete {
  athlete?: EspnAthlete;
  stats?: string[];
  starter?: boolean;
  active?: boolean;
}

export interface EspnBoxscorePlayerGroup {
  team?: EspnTeamRef;
  statistics?: { athletes?: EspnBoxscoreAthlete[]; names?: string[] }[];
}

export interface EspnSummaryResponse {
  header?: { competitions?: EspnCompetition[] };
  boxscore?: { players?: EspnBoxscorePlayerGroup[] };
  plays?: { items?: { text?: string; period?: { number?: number }; type?: { text?: string } }[] };
  situation?: EspnSituation;
}

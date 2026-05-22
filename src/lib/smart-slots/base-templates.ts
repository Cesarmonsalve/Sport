import type { SmartSlotDefinition, Sport } from "@/types";

export type BaseCourtTemplateId = "nba-court-full" | "mlb-field-full";

const NBA_LINEUP_HOME: Omit<SmartSlotDefinition, "id" | "team">[] = [
  { slotType: "lineup-card", label: "LOC 1", left: "40px", top: "720px", width: "200px", height: "88px", slotIndex: 0 },
  { slotType: "lineup-card", label: "LOC 2", left: "40px", top: "820px", width: "200px", height: "88px", slotIndex: 1 },
  { slotType: "lineup-card", label: "LOC 3", left: "40px", top: "920px", width: "200px", height: "88px", slotIndex: 2 },
];

const NBA_LINEUP_AWAY: Omit<SmartSlotDefinition, "id" | "team">[] = [
  { slotType: "lineup-card", label: "VIS 1", left: "1680px", top: "720px", width: "200px", height: "88px", slotIndex: 0 },
  { slotType: "lineup-card", label: "VIS 2", left: "1680px", top: "820px", width: "200px", height: "88px", slotIndex: 1 },
  { slotType: "lineup-card", label: "VIS 3", left: "1680px", top: "920px", width: "200px", height: "88px", slotIndex: 2 },
];

const NBA_COURT: SmartSlotDefinition[] = [
  { id: "court-home-pg", slotType: "field-name-only", label: "PG", left: "720px", top: "520px", team: "home", slotIndex: 0 },
  { id: "court-home-sg", slotType: "field-name-only", label: "SG", left: "820px", top: "480px", team: "home", slotIndex: 1 },
  { id: "court-home-sf", slotType: "field-name-only", label: "SF", left: "920px", top: "520px", team: "home", slotIndex: 2 },
  { id: "court-home-pf", slotType: "field-name-only", label: "PF", left: "780px", top: "620px", team: "home", slotIndex: 3 },
  { id: "court-home-c", slotType: "field-name-only", label: "C", left: "880px", top: "660px", team: "home", slotIndex: 4 },
  { id: "court-away-pg", slotType: "field-name-only", label: "PG", left: "520px", top: "520px", team: "away", slotIndex: 0 },
  { id: "court-away-sg", slotType: "field-name-only", label: "SG", left: "420px", top: "480px", team: "away", slotIndex: 1 },
  { id: "court-away-sf", slotType: "field-name-only", label: "SF", left: "320px", top: "520px", team: "away", slotIndex: 2 },
  { id: "court-away-pf", slotType: "field-name-only", label: "PF", left: "460px", top: "620px", team: "away", slotIndex: 3 },
  { id: "court-away-c", slotType: "field-name-only", label: "C", left: "360px", top: "660px", team: "away", slotIndex: 4 },
  ...NBA_LINEUP_HOME.map((s, i) => ({ ...s, id: `smart-lu-h${i + 1}`, team: "home" as const })),
  ...NBA_LINEUP_AWAY.map((s, i) => ({ ...s, id: `smart-lu-a${i + 1}`, team: "away" as const })),
];

const MLB_FIELD: SmartSlotDefinition[] = [
  { id: "field-cf", slotType: "field-name-only", label: "CF", left: "860px", top: "120px", slotIndex: 0 },
  { id: "field-p", slotType: "field-name-only", label: "P", left: "960px", top: "380px", slotIndex: 4 },
  { id: "field-c", slotType: "field-name-only", label: "C", left: "720px", top: "480px", slotIndex: 8 },
  { id: "field-1b", slotType: "field-name-only", label: "1B", left: "1080px", top: "480px", slotIndex: 7 },
  { id: "field-2b", slotType: "field-name-only", label: "2B", left: "900px", top: "300px", slotIndex: 5 },
  { id: "field-ss", slotType: "field-name-only", label: "SS", left: "780px", top: "300px", slotIndex: 6 },
  { id: "field-3b", slotType: "field-name-only", label: "3B", left: "700px", top: "480px", slotIndex: 7 },
  { id: "field-lf", slotType: "field-name-only", label: "LF", left: "640px", top: "120px", slotIndex: 1 },
  { id: "field-rf", slotType: "field-name-only", label: "RF", left: "1080px", top: "120px", slotIndex: 2 },
  { id: "smart-lu-h1", slotType: "lineup-card", label: "HOME 1", left: "32px", top: "200px", width: "220px", height: "90px", team: "home", slotIndex: 0 },
  { id: "smart-lu-h2", slotType: "lineup-card", label: "HOME 2", left: "32px", top: "300px", width: "220px", height: "90px", team: "home", slotIndex: 1 },
  { id: "smart-lu-a1", slotType: "lineup-card", label: "AWAY 1", left: "1668px", top: "200px", width: "220px", height: "90px", team: "away", slotIndex: 0 },
  { id: "smart-lu-a2", slotType: "lineup-card", label: "AWAY 2", left: "1668px", top: "300px", width: "220px", height: "90px", team: "away", slotIndex: 1 },
];

export const BASE_COURT_TEMPLATES: Record<
  BaseCourtTemplateId,
  {
    sport: Sport;
    name: string;
    backgroundImage: string;
    backgroundDarken: number;
    slots: SmartSlotDefinition[];
    visibility: Record<string, boolean>;
  }
> = {
  "nba-court-full": {
    sport: "nba",
    name: "Cancha NBA completa",
    backgroundImage:
      "linear-gradient(180deg, rgba(8,12,24,0.95) 0%, rgba(18,28,48,0.9) 40%, rgba(12,18,32,0.95) 100%)",
    backgroundDarken: 25,
    slots: NBA_COURT,
    visibility: {
      "nba-scorebug": true,
      "court-positions-widget": false,
      "quinteto-widget": false,
      "card-jugador": false,
    },
  },
  "mlb-field-full": {
    sport: "mlb",
    name: "Campo MLB completo",
    backgroundImage:
      "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(20,80,40,0.35) 0%, rgba(6,14,8,0.95) 70%)",
    backgroundDarken: 30,
    slots: MLB_FIELD,
    visibility: {
      scoreboard: true,
      "field-positions-widget": false,
      "roster-widget": false,
    },
  },
};

export function slotsToRecords(slots: SmartSlotDefinition[]) {
  const positions: Record<string, { left: string; top: string }> = {};
  const smartSlots: Record<string, SmartSlotDefinition> = {};
  const visibility: Record<string, boolean> = {};
  for (const s of slots) {
    positions[s.id] = { left: s.left, top: s.top };
    smartSlots[s.id] = s;
    visibility[s.id] = true;
  }
  return { positions, smartSlots, visibility };
}

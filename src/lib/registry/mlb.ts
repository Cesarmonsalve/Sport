import type { RegistryEntry } from "@/types";
import { MLB_EXTENDED } from "@/lib/registry/mlb-extended";
import { buildRosterAtoms } from "@/lib/registry/lineup-atoms";

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

export const MLB_REGISTRY: Record<string, RegistryEntry> = {
  scoreboard: entry("scoreboard", "Marcador superior", "Marcador", {
    compound: true,
    children: ["sb-sc-v", "sb-sc-h", "sb-abbr-v", "sb-abbr-h", "sb-inn-n", "sb-inn-s"],
    defaults: { left: "24px", top: "16px" },
  }),
  "sb-sc-v": entry("sb-sc-v", "Carreras visitante", "Marcador · dígitos", {
    parent: "scoreboard",
    defaults: { fontSize: "52px", fontFamily: "Bebas Neue", color: "#fff" },
  }),
  "sb-sc-h": entry("sb-sc-h", "Carreras local", "Marcador · dígitos", {
    parent: "scoreboard",
    defaults: { fontSize: "52px", fontFamily: "Bebas Neue", color: "#fff" },
  }),
  "sb-abbr-v": entry("sb-abbr-v", "Abbr visitante", "Marcador · equipos", {
    parent: "scoreboard",
    defaults: { fontSize: "28px", fontFamily: "Bebas Neue" },
  }),
  "sb-abbr-h": entry("sb-abbr-h", "Abbr local", "Marcador · equipos", {
    parent: "scoreboard",
    defaults: { fontSize: "28px", fontFamily: "Bebas Neue" },
  }),
  "sb-inn-n": entry("sb-inn-n", "Inning número", "Marcador · inning", {
    parent: "scoreboard",
    defaults: { fontSize: "22px", fontFamily: "Bebas Neue", color: "#c9a227" },
  }),
  "line-score": entry("line-score", "Line score por innings", "Line score", {
    compound: true,
    defaults: { left: "24px", top: "120px" },
  }),
  "bases-widget": entry("bases-widget", "Bases B/S/O", "Situación", {
    compound: true,
    defaults: { left: "1400px", top: "880px" },
  }),
  "matchup-widget": entry("matchup-widget", "Pitcher vs bateador", "Matchup", {
    compound: true,
    defaults: { left: "400px", top: "780px" },
  }),
  "roster-widget": entry("roster-widget", "Roster lineup (12)", "Roster", {
    compound: true,
    defaults: { left: "1400px", top: "200px" },
  }),
  "play-ticker": entry("play-ticker", "Play ticker", "Ticker", {
    compound: true,
    defaults: { left: "24px", top: "980px", width: "900px" },
  }),
};

const ROSTER_ATOMS = buildRosterAtoms();
Object.assign(MLB_REGISTRY, MLB_EXTENDED, ROSTER_ATOMS);
MLB_REGISTRY["roster-widget"].children = Object.keys(ROSTER_ATOMS);

MLB_REGISTRY["team-logo-home"] = entry("team-logo-home", "Logo local (standalone)", "Logos", {
  defaults: { left: "1600px", top: "40px", width: "80px", height: "80px" },
});
MLB_REGISTRY["team-logo-away"] = entry("team-logo-away", "Logo visitante (standalone)", "Logos", {
  defaults: { left: "200px", top: "40px", width: "80px", height: "80px" },
});

export const MLB_PRESETS = {
  broadcast: {
    label: "Broadcast TV",
    map: { "sb-sc-v": { fontSize: "56px" }, "sb-sc-h": { fontSize: "56px" } },
  },
  compact: {
    label: "Compacto",
    map: { scoreboard: { fontSize: "12px" } },
  },
} as const;

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
  "line-score": entry("Line score", "Marcador", "Line score", {
    compound: true,
    defaults: { left: "24px", top: "120px" },
  }),
  "roster-widget": entry("Roster lineup", "Roster", "Roster", {
    compound: true,
    defaults: { left: "1400px", top: "200px" },
  }),
};

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

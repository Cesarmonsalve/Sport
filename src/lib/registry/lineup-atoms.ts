import type { RegistryEntry } from "@/types";

const e = (
  id: string,
  label: string,
  category: string,
  opts?: Partial<RegistryEntry>
): RegistryEntry => ({ id, label, category, atom: true, defaults: {}, ...opts });

/** Atoms NBA quinteto: q-{team}-{i}-{part} */
export function buildQuintetoAtoms(): Record<string, RegistryEntry> {
  const out: Record<string, RegistryEntry> = {};
  for (const team of ["home", "away"] as const) {
    const side = team === "home" ? "Local" : "Visitante";
    const color = team === "home" ? "#1a5cff" : "#ff7a00";
    for (let i = 0; i < 5; i++) {
      const base = `q-${team}-${i}`;
      out[`${base}-pos`] = e(`${base}-pos`, `${side} · P${i + 1} pos`, "Quinteto · átomo", {
        parent: "quinteto-widget",
        defaults: { fontSize: "10px", color },
      });
      out[`${base}-photo`] = e(`${base}-photo`, `${side} · P${i + 1} foto`, "Quinteto · átomo", {
        parent: "quinteto-widget",
        defaults: { width: "36px", height: "36px" },
      });
      out[`${base}-name`] = e(`${base}-name`, `${side} · P${i + 1} nombre`, "Quinteto · átomo", {
        parent: "quinteto-widget",
        defaults: { fontSize: "12px" },
      });
      out[`${base}-stats`] = e(`${base}-stats`, `${side} · P${i + 1} stats`, "Quinteto · átomo", {
        parent: "quinteto-widget",
        defaults: { fontSize: "10px", color: "rgba(255,255,255,0.5)" },
      });
    }
  }
  const children = Object.keys(out);
  return out;
}

/** Atoms MLB roster: roster-{team}-{i}-{part} */
export function buildRosterAtoms(): Record<string, RegistryEntry> {
  const out: Record<string, RegistryEntry> = {};
  for (const team of ["home", "away"] as const) {
    const side = team === "home" ? "Local" : "Visitante";
    for (let i = 0; i < 12; i++) {
      const base = `roster-${team}-${i}`;
      out[`${base}-photo`] = e(`${base}-photo`, `${side} · #${i + 1} foto`, "Roster · átomo", {
        parent: "roster-widget",
      });
      out[`${base}-name`] = e(`${base}-name`, `${side} · #${i + 1} nombre`, "Roster · átomo", {
        parent: "roster-widget",
        defaults: { fontSize: "11px" },
      });
      out[`${base}-stats`] = e(`${base}-stats`, `${side} · #${i + 1} stats`, "Roster · átomo", {
        parent: "roster-widget",
        defaults: { fontSize: "10px" },
      });
    }
  }
  return out;
}

export const QUINTETO_ATOM_IDS = Object.keys(buildQuintetoAtoms());
export const ROSTER_ATOM_IDS = Object.keys(buildRosterAtoms());

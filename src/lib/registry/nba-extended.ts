import type { RegistryEntry } from "@/types";

const e = (
  id: string,
  label: string,
  category: string,
  opts?: Partial<RegistryEntry>
): RegistryEntry => ({ id, label, category, defaults: {}, ...opts });

/** Atoms adicionales NBA — merge en registry */
export const NBA_EXTENDED: Record<string, RegistryEntry> = {
  "roster-panel": e("roster-panel", "Panel roster (marco)", "Roster", {
    compound: true,
    children: ["quinteto-widget"],
    defaults: { left: "16px", top: "100px", width: "300px", height: "520px" },
  }),
  "court-positions-widget": e("court-positions-widget", "Posiciones en cancha", "Cancha", {
    compound: true,
    children: [
      "court-home-pg", "court-home-sg", "court-home-sf", "court-home-pf", "court-home-c",
      "court-away-pg", "court-away-sg", "court-away-sf", "court-away-pf", "court-away-c",
    ],
    defaults: { left: "380px", top: "200px" },
  }),
  "court-home-pg": e("court-home-pg", "Local · PG", "Cancha · local", {
    parent: "court-positions-widget",
    defaults: { left: "720px", top: "520px", width: "120px", color: "#1a5cff" },
  }),
  "court-home-sg": e("court-home-sg", "Local · SG", "Cancha · local", { parent: "court-positions-widget" }),
  "court-home-sf": e("court-home-sf", "Local · SF", "Cancha · local", { parent: "court-positions-widget" }),
  "court-home-pf": e("court-home-pf", "Local · PF", "Cancha · local", { parent: "court-positions-widget" }),
  "court-home-c": e("court-home-c", "Local · C", "Cancha · local", { parent: "court-positions-widget" }),
  "court-away-pg": e("court-away-pg", "Visitante · PG", "Cancha · visitante", {
    parent: "court-positions-widget",
    defaults: { color: "#ff7a00" },
  }),
  "court-away-sg": e("court-away-sg", "Visitante · SG", "Cancha · visitante", { parent: "court-positions-widget" }),
  "court-away-sf": e("court-away-sf", "Visitante · SF", "Cancha · visitante", { parent: "court-positions-widget" }),
  "court-away-pf": e("court-away-pf", "Visitante · PF", "Cancha · visitante", { parent: "court-positions-widget" }),
  "court-away-c": e("court-away-c", "Visitante · C", "Cancha · visitante", { parent: "court-positions-widget" }),
  "webcam-panel": e("webcam-panel", "Webcam / panel derecho", "Frames", {
    compound: true,
    defaults: {
      left: "1280px", top: "48px", width: "600px", height: "920px",
      borderColor: "#1a5cff", backgroundColor: "rgba(0,0,0,0.85)",
    },
  }),
  "social-footer": e("social-footer", "Barra social", "Footer", {
    compound: true,
    defaults: { left: "0", top: "1020px", width: "1920px", height: "48px" },
  }),
  "sponsor-ticker": e("sponsor-ticker", "Patrocinadores (rotación)", "Patrocinio", {
    defaults: { left: "640px", top: "980px", width: "640px" },
  }),
  "timeouts-bar": e("timeouts-bar", "Timeouts", "Marcador · situación", {
    parent: "nba-scorebug",
    defaults: { left: "400px", top: "110px", fontSize: "12px" },
  }),
};

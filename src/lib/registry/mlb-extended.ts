import type { RegistryEntry } from "@/types";

const e = (
  id: string,
  label: string,
  category: string,
  opts?: Partial<RegistryEntry>
): RegistryEntry => ({ id, label, category, defaults: {}, ...opts });

export const MLB_EXTENDED: Record<string, RegistryEntry> = {
  "roster-panel": e("roster-panel", "Panel roster (marco)", "Roster", {
    compound: true,
    defaults: { left: "12px", top: "140px", width: "260px", height: "560px" },
  }),
  "field-positions-widget": e("field-positions-widget", "Campo 9 posiciones", "Campo", {
    compound: true,
    children: ["field-cf", "field-lf", "field-rf", "field-ss", "field-2b", "field-p", "field-3b", "field-1b", "field-c"],
    defaults: { left: "480px", top: "80px" },
  }),
  "field-cf": e("field-cf", "CF", "Campo", { parent: "field-positions-widget", defaults: { left: "860px", top: "120px" } }),
  "field-lf": e("field-lf", "LF", "Campo", { parent: "field-positions-widget" }),
  "field-rf": e("field-rf", "RF", "Campo", { parent: "field-positions-widget" }),
  "field-ss": e("field-ss", "SS", "Campo", { parent: "field-positions-widget" }),
  "field-2b": e("field-2b", "2B", "Campo", { parent: "field-positions-widget" }),
  "field-p": e("field-p", "P", "Campo", { parent: "field-positions-widget", defaults: { color: "#ff7a00" } }),
  "field-3b": e("field-3b", "3B", "Campo", { parent: "field-positions-widget" }),
  "field-1b": e("field-1b", "1B", "Campo", { parent: "field-positions-widget" }),
  "field-c": e("field-c", "C", "Campo", { parent: "field-positions-widget" }),
  "card-pitcher": e("card-pitcher", "Tarjeta pitcher", "Tarjetas", {
    compound: true,
    defaults: { left: "280px", top: "740px", width: "400px", borderColor: "#1a5cff" },
  }),
  "card-batter": e("card-batter", "Tarjeta bateador", "Tarjetas", {
    compound: true,
    defaults: { left: "720px", top: "740px", width: "400px", borderColor: "#ff7a00" },
  }),
  "webcam-main": e("webcam-main", "Webcam principal", "Frames", {
    compound: true,
    defaults: { left: "1240px", top: "40px", width: "640px", height: "480px", borderColor: "#1a5cff" },
  }),
  "webcam-secondary": e("webcam-secondary", "Webcam secundaria", "Frames", {
    compound: true,
    defaults: { left: "1380px", top: "560px", width: "500px", height: "380px" },
  }),
  "sponsor-ticker": e("sponsor-ticker", "Patrocinadores (rotación)", "Patrocinio", {
    defaults: { left: "640px", top: "980px", width: "640px" },
  }),
};

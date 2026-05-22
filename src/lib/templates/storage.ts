import type { SavedStreamerTemplate } from "@/lib/templates/types";

const KEY = "stream_sports_custom_templates";

export function loadCustomTemplates(): SavedStreamerTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedStreamerTemplate[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplate(t: SavedStreamerTemplate) {
  const list = loadCustomTemplates().filter((x) => x.id !== t.id);
  list.push(t);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function deleteCustomTemplate(id: string) {
  const list = loadCustomTemplates().filter((x) => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}

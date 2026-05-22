import type { StreamTemplate } from "@/lib/templates/types";
import { useEditorStore } from "@/lib/store/editor-store";

/** Plantilla = sugerencia inicial. No pisa estilos que el usuario ya tocó. */
export function applyTemplate(template: StreamTemplate) {
  const s = useEditorStore.getState();
  const touched = new Set(s.userTouchedElements ?? []);

  const positions = { ...s.positions };
  for (const [id, p] of Object.entries(template.positions)) {
    if (!touched.has(id)) positions[id] = p;
  }
  const visibility = { ...s.visibility, ...template.visibility };

  const elements = { ...s.elements };
  for (const [id, st] of Object.entries(template.elements)) {
    if (!touched.has(id)) {
      elements[id] = { ...elements[id], ...st };
    }
  }

  useEditorStore.setState({
    templateId: template.id,
    templateName: template.name,
    positions,
    visibility,
    elements,
    dirtyIds: [
      ...new Set([
        ...s.dirtyIds,
        ...Object.keys(template.positions),
      ]),
    ],
  });
}

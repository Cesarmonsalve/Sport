import type { StreamTemplate } from "@/lib/templates/types";
import { useEditorStore } from "@/lib/store/editor-store";

export function applyTemplate(template: StreamTemplate) {
  const s = useEditorStore.getState();
  useEditorStore.setState({
    templateId: template.id,
    templateName: template.name,
    positions: { ...s.positions, ...template.positions },
    elements: { ...s.elements, ...template.elements },
    visibility: { ...s.visibility, ...template.visibility },
    dirtyIds: [
      ...new Set([
        ...s.dirtyIds,
        ...Object.keys(template.positions),
        ...Object.keys(template.elements),
      ]),
    ],
  });
}

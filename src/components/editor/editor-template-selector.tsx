"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store/editor-store";
import { getTemplatesForSport } from "@/lib/templates";
import { saveCustomTemplate, loadCustomTemplates } from "@/lib/templates/storage";
import type { SavedStreamerTemplate } from "@/lib/templates/types";

export function EditorTemplateSelector() {
  const sport = useEditorStore((s) => s.sport);
  const templateId = useEditorStore((s) => s.templateId);
  const applyStreamTemplate = useEditorStore((s) => s.applyStreamTemplate);
  const exportState = useEditorStore((s) => s.exportState);
  const [custom, setCustom] = useState<SavedStreamerTemplate[]>([]);

  const builtins = getTemplatesForSport(sport);
  const all = [...builtins, ...custom.filter((c) => c.sport === sport)];

  const refreshCustom = () => setCustom(loadCustomTemplates());

  const onSaveCustom = () => {
    const state = exportState();
    const name = prompt("Nombre de tu plantilla:", `Mi layout ${sport}`);
    if (!name) return;
    const t: SavedStreamerTemplate = {
      id: `custom-${Date.now()}`,
      name,
      sport,
      description: "Plantilla personalizada del streamer",
      theme: { accentHome: "#1a5cff", accentAway: "#ff7a00" },
      positions: state.positions,
      elements: state.elements,
      visibility: state.visibility,
      savedAt: new Date().toISOString(),
      room: state.room,
    };
    saveCustomTemplate(t);
    refreshCustom();
  };

  return (
    <div className="flex items-center gap-2 border-t border-border px-4 py-2">
      <Label className="shrink-0 text-xs">Plantilla</Label>
      <select
        className="h-8 max-w-[220px] flex-1 rounded-md border border-border bg-muted/50 px-2 text-xs"
        value={templateId}
        onChange={(e) => {
          const t = all.find((x) => x.id === e.target.value);
          if (t) applyStreamTemplate(t);
        }}
        onFocus={refreshCustom}
      >
        {all.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <Button variant="outline" size="sm" className="text-xs" onClick={onSaveCustom}>
        Guardar mía
      </Button>
    </div>
  );
}

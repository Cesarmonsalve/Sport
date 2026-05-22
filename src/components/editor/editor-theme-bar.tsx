"use client";

import { useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import {
  buildThemeExport,
  downloadThemeJson,
  parseThemeFile,
} from "@/lib/theme/io";

export function EditorThemeBar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const exportState = useEditorStore((s) => s.exportState);
  const importTheme = useEditorStore((s) => s.importTheme);
  const sport = useEditorStore((s) => s.sport);
  const textOverrides = useEditorStore((s) => s.textOverrides);
  const zIndex = useEditorStore((s) => s.zIndex);

  const onExport = () => {
    const state = exportState();
    downloadThemeJson(
      buildThemeExport(state, `${sport}-layout`, { textOverrides, zIndex })
    );
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const theme = parseThemeFile(JSON.parse(reader.result as string));
        if (theme) importTheme(theme);
      } catch {
        /* invalid json */
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2 border-t border-border px-4 py-2">
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-3.5 w-3.5" />
        Exportar tema JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
        <Upload className="h-3.5 w-3.5" />
        Importar tema
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onImport}
      />
    </div>
  );
}

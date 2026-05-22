"use client";

import { useEditorStore } from "@/lib/store/editor-store";
import { SCOREBUG_STYLE_OPTIONS } from "@/lib/scorebug/styles";
import type { ScorebugStyle } from "@/types";
import { cn } from "@/lib/utils";

export function ScorebugStylePicker() {
  const scorebugStyle = useEditorStore((s) => s.scorebugStyle);
  const setScorebugStyle = useEditorStore((s) => s.setScorebugStyle);

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estilo scorebug</p>
      <div className="grid grid-cols-2 gap-1.5">
        {SCOREBUG_STYLE_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setScorebugStyle(value as ScorebugStyle)}
            className={cn(
              "rounded border px-2 py-2 text-left text-[10px] transition-colors",
              scorebugStyle === value
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-accent"
            )}
          >
            <span
              className={cn(
                "mb-1 block h-6 w-full rounded",
                `scorebug-${value === "broadcast" ? "broadcast" : value}`
              )}
            />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

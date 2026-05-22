import { Suspense } from "react";
import { EditorShell } from "@/components/editor/editor-shell";

export default function EditorNbaPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Cargando editor NBA…</div>}>
      <EditorShell sport="nba" />
    </Suspense>
  );
}

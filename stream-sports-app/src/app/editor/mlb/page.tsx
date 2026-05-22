import { Suspense } from "react";
import { EditorShell } from "@/components/editor/editor-shell";

export default function EditorMlbPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Cargando editor MLB…</div>}>
      <EditorShell sport="mlb" />
    </Suspense>
  );
}

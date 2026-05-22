"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorInspector } from "@/components/editor/editor-inspector";
import { EditorCanvasPreview } from "@/components/editor/editor-canvas-preview";
import { EditorHeader } from "@/components/editor/editor-header";
import { EditorDock } from "@/components/editor/editor-dock";
import { useStreamSync } from "@/hooks/use-stream-sync";
import { resolveRoom } from "@/lib/sync/room";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

interface EditorShellProps {
  sport: Sport;
}

export function EditorShell({ sport }: EditorShellProps) {
  const searchParams = useSearchParams();
  const room = resolveRoom(undefined, searchParams);
  const setSport = useEditorStore((s) => s.setSport);

  useEffect(() => {
    setSport(sport);
    const event = searchParams.get("event");
    if (event) useEditorStore.getState().setEventId(event);
  }, [sport, setSport, searchParams]);

  useStreamSync(true, room);

  return (
    <div className="flex h-screen max-w-[100vw] flex-col overflow-hidden bg-background">
      <EditorHeader sport={sport} room={room} />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar sport={sport} />
        <EditorCanvasPreview sport={sport} />
        <EditorInspector sport={sport} />
      </div>
      <EditorDock sport={sport} />
    </div>
  );
}

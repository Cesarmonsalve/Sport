"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorInspector } from "@/components/editor/editor-inspector";
import { EditorCanvasPreview } from "@/components/editor/editor-canvas-preview";
import { EditorHeader } from "@/components/editor/editor-header";
import { ProductionDock } from "@/components/editor/production-dock";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { EditorTemplateSelector } from "@/components/editor/editor-template-selector";
import { EditorContextMenu } from "@/components/editor/editor-context-menu";
import { RotationToast } from "@/components/editor/rotation-toast";
import { SelectionFloatingToolbar } from "@/components/editor/selection-floating-toolbar";
import { EditorSyncProvider } from "@/components/editor/editor-sync-context";
import { useStreamSync } from "@/hooks/use-stream-sync";
import { useEditorShortcuts } from "@/hooks/use-editor-shortcuts";
import { resolveRoom } from "@/lib/sync/room";
import { galleryFromMlbGame, galleryFromNbaGame } from "@/lib/espn/gallery";
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
    if (searchParams.get("design") === "1") {
      useEditorStore.getState().setDesignMode(true);
    }
    const s = useEditorStore.getState();
    if (s.designMode) {
      s.setGalleryPlayers(
        sport === "nba" ? galleryFromNbaGame(s.nbaGame) : galleryFromMlbGame(s.mlbGame)
      );
    }
  }, [sport, setSport, searchParams]);

  const { publishNow } = useStreamSync(true, room);
  const registerLayoutPublisher = useEditorStore((s) => s.registerLayoutPublisher);

  useEffect(() => {
    registerLayoutPublisher(publishNow);
    return () => registerLayoutPublisher(null);
  }, [publishNow, registerLayoutPublisher]);

  useEditorShortcuts();

  return (
    <EditorSyncProvider publishNow={publishNow}>
    <div className="flex h-screen max-w-[100vw] flex-col overflow-hidden bg-background">
      <EditorHeader sport={sport} room={room} />
      <div className="flex min-h-0 flex-1">
        <EditorSidebar sport={sport} />
        <EditorCanvasPreview sport={sport} />
        <EditorInspector sport={sport} />
      </div>
      <EditorTemplateSelector />
      <ProductionDock sport={sport} room={room} />
      <OnboardingModal />
      <EditorContextMenu />
      <RotationToast />
      <SelectionFloatingToolbar />
    </div>
    </EditorSyncProvider>
  );
}

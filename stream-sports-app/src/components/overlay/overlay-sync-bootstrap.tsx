"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useStreamSync } from "@/hooks/use-stream-sync";
import { resolveRoom } from "@/lib/sync/room";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

export function OverlaySyncBootstrap({ sport }: { sport: Sport }) {
  const searchParams = useSearchParams();
  const room = resolveRoom(undefined, searchParams);
  const setSport = useEditorStore((s) => s.setSport);
  const designParam = searchParams.get("design") === "1";

  useEffect(() => {
    setSport(sport);
    if (designParam) useEditorStore.getState().setDesignMode(true);
  }, [sport, setSport, designParam]);

  useStreamSync(false, room);

  return null;
}

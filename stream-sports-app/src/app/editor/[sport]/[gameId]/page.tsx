"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

/** Deep-link: /editor/nba/401234567 → redirige al editor con eventId precargado */
export default function EditorGamePage() {
  const params = useParams();
  const router = useRouter();
  const sport = params.sport as string;
  const gameId = params.gameId as string;
  const setEventId = useEditorStore((s) => s.setEventId);

  useEffect(() => {
    if (sport !== "nba" && sport !== "mlb") {
      router.replace("/");
      return;
    }
    setEventId(gameId);
    router.replace(`/editor/${sport}?event=${gameId}`);
  }, [sport, gameId, setEventId, router]);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      Abriendo editor…
    </div>
  );
}

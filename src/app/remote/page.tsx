"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEditorStore } from "@/lib/store/editor-store";
import { useMqttSubscribe } from "@/hooks/use-mqtt-subscribe";
import { getScenesForSport } from "@/lib/scenes/broadcast-scenes";
import { getPersistedRoom } from "@/lib/sync/room";
import type { Sport } from "@/types";

function useRemoteRoom() {
  const params = useSearchParams();
  return params.get("room") || getPersistedRoom() || "DEMO";
}

function RemoteControlInner() {
  const room = useRemoteRoom();
  const sport = useEditorStore((s) => s.sport);
  const setSport = useEditorStore((s) => s.setSport);
  const nbaGame = useEditorStore((s) => s.nbaGame);
  const mlbGame = useEditorStore((s) => s.mlbGame);
  const visibility = useEditorStore((s) => s.visibility);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const setNbaGame = useEditorStore((s) => s.setNbaGame);
  const setMlbGame = useEditorStore((s) => s.setMlbGame);
  const applyBroadcastScene = useEditorStore((s) => s.applyBroadcastScene);
  const syncStatus = useEditorStore((s) => s.syncStatus);
  const { publishNow } = useMqttSubscribe(room);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const game = sport === "nba" ? nbaGame : mlbGame;
  const scenes = getScenesForSport(sport);
  const quickWidgets = useMemo(
    () =>
      sport === "nba"
        ? ["nba-scorebug", "quinteto-widget", "broadcast-ticker", "nba-lower-third"]
        : ["scoreboard", "roster-widget", "broadcast-ticker", "mlb-lower-third"],
    [sport]
  );

  const bumpScore = (side: "home" | "away", delta: number) => {
    if (sport === "nba") {
      setNbaGame({
        ...nbaGame,
        scoreHome: nbaGame.scoreHome + (side === "home" ? delta : 0),
        scoreAway: nbaGame.scoreAway + (side === "away" ? delta : 0),
      });
    } else {
      setMlbGame({
        ...mlbGame,
        scoreHome: mlbGame.scoreHome + (side === "home" ? delta : 0),
        scoreAway: mlbGame.scoreAway + (side === "away" ? delta : 0),
      });
    }
    publishNow();
  };

  const live = syncStatus.includes("connected");

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-sm font-semibold">
          Stream Sports
        </Link>
        <Badge variant={live ? "success" : "secondary"} className="font-mono text-[10px]">
          {live ? "🔴 EN VIVO" : "OFF"} · {room}
        </Badge>
      </div>

      <div className="flex gap-2 mb-4">
        {(["nba", "mlb"] as Sport[]).map((s) => (
          <Button
            key={s}
            variant={sport === s ? "default" : "outline"}
            className="flex-1 h-12 uppercase"
            onClick={() => {
              setSport(s);
              publishNow();
            }}
          >
            {s}
          </Button>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 text-center mb-4">
        <p className="text-3xl font-bold tracking-tight">
          {game.awayAbbr}{" "}
          <span className="text-muted-foreground mx-2">|</span>
          {sport === "nba" ? nbaGame.scoreAway : mlbGame.scoreAway}
          <span className="mx-3 text-muted-foreground">—</span>
          {sport === "nba" ? nbaGame.scoreHome : mlbGame.scoreHome}{" "}
          {game.homeAbbr}
        </p>
        <p className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Radio className="h-3.5 w-3.5" />
          {sport === "nba"
            ? `${nbaGame.period} · ${nbaGame.clock}`
            : `${mlbGame.inningHalf} ${mlbGame.inning}`}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-2 mb-6">
        {[1, 2, 3].map((pts) => (
          <div key={pts} className="contents">
            <Button
              className="h-16 text-base"
              variant="outline"
              onClick={() => bumpScore("home", pts)}
            >
              +{pts} HOME
            </Button>
            <Button
              className="h-16 text-base"
              variant="outline"
              onClick={() => bumpScore("away", pts)}
            >
              +{pts} AWAY
            </Button>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Escenas</h2>
        <div className="flex flex-col gap-2">
          {scenes.map((sc) => (
            <Button
              key={sc.id}
              className="h-14 justify-start"
              variant="secondary"
              onClick={() => {
                applyBroadcastScene(sc.id);
                publishNow();
              }}
            >
              {sc.label}
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Widgets rápidos
        </h2>
        <div className="flex flex-col gap-2">
          {quickWidgets.map((id) => {
            const vis = visibility[id] !== false;
            return (
              <Button
                key={id}
                className="h-14 justify-between"
                variant={vis ? "default" : "outline"}
                onClick={() => {
                  setVisibility(id, !vis);
                  publishNow();
                }}
              >
                <span className="font-mono text-xs">{id}</span>
                {vis ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5 opacity-50" />}
              </Button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function RemoteControlPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Cargando control remoto…</div>}>
      <RemoteControlInner />
    </Suspense>
  );
}

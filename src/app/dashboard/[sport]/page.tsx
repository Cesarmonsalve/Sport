"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { useEspnLeaders, useEspnNews, useEspnStandings } from "@/hooks/use-espn-dashboard";
import { useEditorStore } from "@/lib/store/editor-store";
import { getPersistedRoom, appendRoomToPath } from "@/lib/sync/room";
import type { Sport } from "@/types";

function isSport(s: string): s is Sport {
  return s === "nba" || s === "mlb";
}

function GameCard({
  ev,
  sport,
  room,
  onSelect,
}: {
  ev: { id: string; shortName?: string; name: string; status: string; state: string };
  sport: Sport;
  room: string;
  onSelect: () => void;
}) {
  const live = ev.state === "in";
  return (
    <li>
      <Link
        href={appendRoomToPath(`/editor/${sport}?event=${ev.id}`, room)}
        className={`flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-muted/40 ${
          live ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"
        }`}
        onClick={onSelect}
      >
        <span className="font-medium text-sm">
          {live && <span className="inline-block animate-pulse mr-1">🔴</span>}
          {ev.shortName || ev.name}
        </span>
        <span className="text-xs text-muted-foreground">{ev.status}</span>
      </Link>
    </li>
  );
}

export default function SportDashboardPage() {
  const params = useParams();
  const raw = String(params.sport ?? "");
  const sport: Sport = isSport(raw) ? raw : "nba";
  const [tab, setTab] = useState("today");
  const setSport = useEditorStore((s) => s.setSport);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const setEventId = useEditorStore((s) => s.setEventId);
  const { events, isLoading } = useEspnPoll(sport);
  const standings = useEspnStandings(sport);
  const leaders = useEspnLeaders(sport);
  const news = useEspnNews(sport);
  const room = getPersistedRoom() || "DEMO";

  useEffect(() => {
    setSport(sport);
    setDesignMode(false);
  }, [sport, setSport, setDesignMode]);

  const live = events.filter((e) => e.state === "in");
  const upcoming = events.filter((e) => e.state === "pre");
  const recent = events.filter((e) => e.state === "post").slice(0, 14);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5 border-b border-zinc-800">
        <Link href="/" className="text-sm font-medium text-zinc-100 hover:text-white">
          Stream Sports
        </Link>
        <div className="flex gap-2">
          <Badge variant="secondary" className="uppercase">
            {sport}
          </Badge>
          <Link href={appendRoomToPath(`/remote`, room)} className="text-xs text-primary hover:underline">
            Remote
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <h1 className="text-2xl font-semibold capitalize">Dashboard {sport.toUpperCase()}</h1>

        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="leaders">Líderes</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-6 space-y-8">
            <section>
              <h2 className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                <Radio className="h-4 w-4" />
                En vivo ({live.length})
              </h2>
              {isLoading && <p className="mt-4 text-xs text-muted-foreground">Cargando ESPN…</p>}
              <ul className="mt-4 space-y-2">
                {live.map((ev) => (
                  <GameCard
                    key={ev.id}
                    ev={ev}
                    sport={sport}
                    room={room}
                    onSelect={() => setEventId(ev.id)}
                  />
                ))}
              </ul>
            </section>
            <section>
              <h2 className="text-sm font-medium text-muted-foreground">Próximos</h2>
              <ul className="mt-4 space-y-2">
                {upcoming.slice(0, 8).map((ev) => (
                  <GameCard
                    key={ev.id}
                    ev={ev}
                    sport={sport}
                    room={room}
                    onSelect={() => setEventId(ev.id)}
                  />
                ))}
              </ul>
            </section>
          </TabsContent>

          <TabsContent value="standings" className="mt-6">
            {standings.isLoading && <p className="text-xs text-muted-foreground">Cargando tabla…</p>}
            <pre className="text-[10px] overflow-auto max-h-[480px] rounded border border-border p-4 bg-muted/30">
              {JSON.stringify(standings.data, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="leaders" className="mt-6">
            {leaders.isLoading && <p className="text-xs text-muted-foreground">Cargando líderes…</p>}
            <pre className="text-[10px] overflow-auto max-h-[480px] rounded border border-border p-4 bg-muted/30">
              {JSON.stringify(leaders.data, null, 2)}
            </pre>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ul className="space-y-2">
              {recent.map((ev) => (
                <GameCard
                  key={ev.id}
                  ev={ev}
                  sport={sport}
                  room={room}
                  onSelect={() => setEventId(ev.id)}
                />
              ))}
            </ul>
          </TabsContent>

        </Tabs>

        <section className="mt-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Headlines</h2>
          <ul className="text-xs space-y-1 text-muted-foreground">
            {((news.data as { articles?: { headline?: string }[] })?.articles ?? [])
              .slice(0, 5)
              .map((a, i) => (
                <li key={i}>· {a.headline}</li>
              ))}
          </ul>
        </section>

        <div className="mt-10 flex gap-3 flex-wrap">
          <Button asChild>
            <Link href={appendRoomToPath(`/editor/${sport}`, room)}>
              Abrir editor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={appendRoomToPath(`/editor/${sport}?design=1`, room)}>Modo mock</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={appendRoomToPath(`/overlay/${sport}/ticker`, room)}>Ticker OBS</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

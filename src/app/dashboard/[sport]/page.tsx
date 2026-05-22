"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { useEditorStore } from "@/lib/store/editor-store";
import type { Sport } from "@/types";

function isSport(s: string): s is Sport {
  return s === "nba" || s === "mlb";
}

export default function SportDashboardPage() {
  const params = useParams();
  const raw = String(params.sport ?? "");
  const sport: Sport = isSport(raw) ? raw : "nba";
  const setSport = useEditorStore((s) => s.setSport);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const setEventId = useEditorStore((s) => s.setEventId);
  const { events, isLoading } = useEspnPoll(sport);

  useEffect(() => {
    setSport(sport);
    setDesignMode(false);
  }, [sport, setSport, setDesignMode]);

  const live = events.filter((e) => e.state === "in");
  const recent = events.filter((e) => e.state !== "in").slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-sm font-semibold">
          Stream Sports
        </Link>
        <Badge variant="secondary" className="uppercase">
          {sport}
        </Badge>
      </nav>
      <main className="mx-auto max-w-4xl px-6 pb-16">
        <h1 className="text-2xl font-semibold capitalize">Partidos {sport.toUpperCase()}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecciona un partido para abrir el editor con ESPN conectado.
        </p>

        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <Radio className="h-4 w-4" />
            En vivo hoy ({live.length})
          </h2>
          {isLoading && <p className="mt-4 text-xs text-muted-foreground">Cargando ESPN…</p>}
          <ul className="mt-4 space-y-2">
            {live.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/editor/${sport}?event=${ev.id}`}
                  className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 hover:bg-emerald-500/10"
                  onClick={() => setEventId(ev.id)}
                >
                  <span className="font-medium text-sm">
                    🔴 {ev.shortName || ev.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{ev.status}</span>
                </Link>
              </li>
            ))}
            {!isLoading && live.length === 0 && (
              <p className="text-xs text-muted-foreground">No hay partidos en vivo ahora.</p>
            )}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-muted-foreground">Recientes / programados</h2>
          <ul className="mt-4 space-y-2">
            {recent.map((ev) => (
              <li key={ev.id}>
                <Link
                  href={`/editor/${sport}?event=${ev.id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-muted/40"
                >
                  <span className="text-sm">{ev.shortName || ev.name}</span>
                  <span className="text-xs text-muted-foreground">{ev.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex gap-3">
          <Button asChild>
            <Link href={`/editor/${sport}`}>
              Editor sin partido fijo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/editor/${sport}?design=1`}>Modo mock / diseño</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}

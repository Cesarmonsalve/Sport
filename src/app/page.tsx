import Link from "next/link";
import {
  ArrowRight,
  Monitor,
  Radio,
  Layers,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Monitor,
    title: "OBS Browser Source",
    desc: "Una URL por widget (?widget=id). Canvas 1920×1080, fondo transparente.",
  },
  {
    icon: Radio,
    title: "ESPN en vivo",
    desc: "Scoreboard + summary cada 5–12s en partidos activos. Headshots y rotaciones.",
  },
  {
    icon: Layers,
    title: "Editor broadcast",
    desc: "Capas colapsables, drag en canvas, inspector Diseño/Datos/Anim/Vis.",
  },
  {
    icon: Zap,
    title: "Sync MQTT",
    desc: "Panel → overlays sin refrescar. Room privado por transmisión.",
  },
];

const nbaWidgets = [
  { id: "nba-scorebug", label: "Scorebug" },
  { id: "card-jugador", label: "Tarjeta jugador" },
  { id: "quinteto-widget", label: "Quinteto" },
  { id: "destacado-widget", label: "Destacado" },
];

const mlbWidgets = [
  { id: "scoreboard", label: "Marcador" },
  { id: "line-score", label: "Line score" },
  { id: "bases-widget", label: "Bases B/S/O" },
  { id: "matchup-widget", label: "Matchup" },
  { id: "roster-widget", label: "Roster" },
  { id: "play-ticker", label: "Play ticker" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-sm font-semibold tracking-tight">Stream Sports</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/editor/nba" className="hover:text-foreground transition-colors">
            Editor NBA
          </Link>
          <Link href="/editor/mlb" className="hover:text-foreground transition-colors">
            Editor MLB
          </Link>
          <Badge variant="success">Next.js 15</Badge>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="pt-12 pb-16">
          <p className="mb-4 text-sm text-[#00b8d4] uppercase tracking-widest">
            Producción deportiva
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Overlays NBA y MLB listos para OBS
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Scorebug, quinteto, line score, bases, matchup y más. Control desde el
            editor, salida transparente por widget, datos ESPN en tiempo real.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/editor/nba">
                Editor NBA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/editor/mlb">Editor MLB</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/overlay/nba?design=1">Preview diseño NBA</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <LayoutGrid className="h-4 w-4 text-[#00b8d4]" />
              Widgets NBA (OBS)
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
              {nbaWidgets.map((w) => (
                <li key={w.id}>
                  <Link
                    href={`/overlay/nba?design=1&widget=${w.id}`}
                    className="hover:text-foreground"
                  >
                    /overlay/nba?widget={w.id}
                  </Link>
                  <span className="ml-2 text-foreground/60">— {w.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <LayoutGrid className="h-4 w-4 text-[#c9a227]" />
              Widgets MLB (OBS)
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-xs text-muted-foreground">
              {mlbWidgets.map((w) => (
                <li key={w.id}>
                  <Link
                    href={`/overlay/mlb?design=1&widget=${w.id}`}
                    className="hover:text-foreground"
                  >
                    /overlay/mlb?widget={w.id}
                  </Link>
                  <span className="ml-2 text-foreground/60">— {w.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-xl border border-border bg-card p-8">
          <div className="aspect-video max-h-[240px] rounded-lg bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] flex items-center justify-center gap-12 border border-border">
            <div className="text-center">
              <p
                className="text-5xl font-bold"
                style={{ fontFamily: '"Bebas Neue", sans-serif', color: "#e11d48" }}
              >
                102
              </p>
              <p className="text-xs text-muted-foreground">BOS</p>
            </div>
            <p className="text-sm text-muted-foreground">Q4 2:34</p>
            <div className="text-center">
              <p
                className="text-5xl font-bold"
                style={{ fontFamily: '"Bebas Neue", sans-serif', color: "#00b8d4" }}
              >
                98
              </p>
              <p className="text-xs text-muted-foreground">LAL</p>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Producción:</strong> abre el editor, elige
            partido ESPN, activa widgets en capas y copia URLs OBS desde el header (añade{" "}
            <code className="text-xs">?room=TU_SALA</code> en cada fuente).
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Stream Sports · Datos ESPN · No afiliado a ligas ni ESPN
      </footer>
    </div>
  );
}

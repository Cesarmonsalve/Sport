"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Monitor,
  Radio,
  Layers,
  LayoutGrid,
  Zap,
  Download,
  Settings,
  Tv,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Monitor,
    title: "OBS por widget",
    desc: "Rutas dedicadas /overlay/nba/scorebug o ?widget=id. 1920×1080 transparente.",
  },
  {
    icon: Radio,
    title: "ESPN vía proxy",
    desc: "API /api/espn/* sin CORS. Polling 5–12s en vivo, rotaciones con log.",
  },
  {
    icon: Layers,
    title: "Editor pro",
    desc: "Box-select, snap 8px, tema JSON, animación flip en marcador.",
  },
  {
    icon: Zap,
    title: "Sync MQTT",
    desc: "Panel → overlays en tiempo real con room privado.",
  },
];

const steps = [
  { n: "01", title: "Abre el editor", desc: "Elige NBA o MLB y activa modo diseño para maquetar sin partido." },
  { n: "02", title: "Posiciona widgets", desc: "Arrastra en canvas, exporta tema JSON, copia URLs OBS del header." },
  { n: "03", title: "Conecta ESPN", desc: "Selecciona partido en el dock; scorebug anima cada cambio de puntos." },
  { n: "04", title: "Transmite", desc: "Browser Sources en OBS con el mismo ?room= en cada fuente." },
];

const nbaWidgets = [
  { id: "nba-scorebug", label: "Scorebug" },
  { id: "card-jugador", label: "Tarjeta" },
  { id: "quinteto-widget", label: "Quinteto" },
  { id: "destacado-widget", label: "Destacado" },
];

const mlbWidgets = [
  { id: "scoreboard", label: "Marcador" },
  { id: "line-score", label: "Line score" },
  { id: "bases-widget", label: "Bases" },
  { id: "matchup-widget", label: "Matchup" },
  { id: "roster-widget", label: "Roster" },
  { id: "play-ticker", label: "Ticker" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-sm font-semibold tracking-tight">Stream Sports</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/dashboard/nba" className="hover:text-foreground transition-colors">
            NBA hoy
          </Link>
          <Link href="/dashboard/mlb" className="hover:text-foreground transition-colors">
            MLB hoy
          </Link>
          <Link href="/settings" className="hover:text-foreground transition-colors">
            Ajustes
          </Link>
          <Badge variant="success">Producción</Badge>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="pt-10 pb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm text-[#00b8d4] uppercase tracking-[0.25em]"
          >
            Broadcast overlays
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Producción NBA y MLB lista para OBS — con animaciones y ESPN en vivo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Scorebug con flip al anotar, quinteto, line score, bases, matchup, export de
            tema JSON y rutas limpias por widget.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link href="/dashboard/nba">
                NBA en vivo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/mlb">MLB en vivo</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/overlay/nba/nba-scorebug?design=1">Preview scorebug</Link>
            </Button>
          </motion.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card/80 p-5"
            >
              <span className="text-2xl font-bold text-primary/40">{s.n}</span>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-gradient-to-br from-[#0d1117] to-[#151b28] p-8"
          >
            <div className="flex items-end justify-center gap-10 py-8">
              <div className="text-center">
                <p
                  className="text-6xl font-bold text-[#e11d48]"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  102
                </p>
                <p className="text-xs text-muted-foreground mt-1">BOS · visitante</p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <Tv className="h-5 w-5 mx-auto mb-2 text-[#c9a227]" />
                Q4 2:34
              </div>
              <div className="text-center">
                <p
                  className="text-6xl font-bold text-[#00b8d4]"
                  style={{ fontFamily: '"Bebas Neue", sans-serif' }}
                >
                  98
                </p>
                <p className="text-xs text-muted-foreground mt-1">LAL · local</p>
              </div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
              Scorebug NBA · animación flip al cambiar puntos
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h2 className="flex items-center gap-2 font-semibold text-sm">
              <Settings className="h-4 w-4" />
              Capturas de flujo
            </h2>
            <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <Download className="h-4 w-4 shrink-0 text-primary" />
                Exporta tema JSON desde el editor (posiciones, colores, visibilidad).
              </li>
              <li className="flex gap-2">
                <LayoutGrid className="h-4 w-4 shrink-0 text-primary" />
                Modo simple: arrastra el scorebug entero; avanzado: hijos sueltos.
              </li>
              <li className="flex gap-2">
                <Radio className="h-4 w-4 shrink-0 text-primary" />
                Consola del navegador registra rotaciones NBA detectadas.
              </li>
            </ul>
          </motion.div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <LayoutGrid className="h-4 w-4 text-[#00b8d4]" />
              Rutas NBA
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground">
              {nbaWidgets.map((w) => (
                <li key={w.id}>
                  <Link href={`/overlay/nba/${w.id}?design=1`} className="hover:text-foreground">
                    /overlay/nba/{w.id}
                  </Link>
                  <span className="ml-2 opacity-60">— {w.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <LayoutGrid className="h-4 w-4 text-[#c9a227]" />
              Rutas MLB
            </h2>
            <ul className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground">
              {mlbWidgets.map((w) => (
                <li key={w.id}>
                  <Link href={`/overlay/mlb/${w.id}?design=1`} className="hover:text-foreground">
                    /overlay/mlb/{w.id}
                  </Link>
                  <span className="ml-2 opacity-60">— {w.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-14 rounded-xl border border-border bg-card p-6 overflow-x-auto">
          <h2 className="font-semibold text-sm mb-4">Stream Sports vs overlays manuales en OBS</h2>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="py-2 pr-4">Capacidad</th>
                <th className="py-2 pr-4">Manual (texto/imagen)</th>
                <th className="py-2">Stream Sports</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Marcador ESPN auto", "No", "Sí — proxy NBA/MLB"],
                ["Rotación quinteto NBA", "Manual", "Auto + toast"],
                ["URLs OBS por widget", "Una escena", "Rutas + ?room= MQTT"],
                ["Editor layout 1920×1080", "Photoshop", "Drag + tema/proyecto JSON"],
                ["Coste mensual", "Gratis", "Self-host gratis"],
                ["Patrocinadores rotación", "Capas extra", "Widget sponsor-ticker"],
              ].map(([cap, man, ss]) => (
                <tr key={cap} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-foreground">{cap}</td>
                  <td className="py-2 pr-4">{man}</td>
                  <td className="py-2 text-primary">{ss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-5"
            >
              <Icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Stream Sports · Proxy ESPN · Deploy en Vercel con pnpm build
      </footer>
    </div>
  );
}

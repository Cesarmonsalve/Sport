import Link from "next/link";
import { ArrowRight, Monitor, Radio, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Monitor,
    title: "OBS Browser Source",
    desc: "Fuentes separadas por widget. 1920×1080, fondo transparente.",
  },
  {
    icon: Radio,
    title: "Sync en vivo",
    desc: "MQTT + localStorage. Panel y overlays sin refrescar.",
  },
  {
    icon: Layers,
    title: "Editor broadcast",
    desc: "Capas, presets TV, modo diseño sin partido.",
  },
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
          <Badge variant="success">Producción</Badge>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="pt-16 pb-20">
          <p className="mb-4 text-sm text-muted-foreground">
            Overlays deportivos profesionales
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Controla tu transmisión NBA y MLB desde el navegador
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Panel de producción + fuentes OBS separadas. Datos ESPN en vivo,
            editor visual y sincronización en tiempo real.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/editor/nba">
                Abrir editor NBA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/editor/mlb">Editor MLB</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/overlay/nba?design=1">Vista overlay (diseño)</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-8">
          <div className="aspect-video max-h-[280px] rounded-lg bg-gradient-to-br from-[#0d1117] to-[#1a1f2e] flex items-center justify-center border border-border">
            <div className="text-center">
              <p
                className="text-6xl font-bold tracking-wider"
                style={{ fontFamily: '"Bebas Neue", sans-serif', color: "#00b8d4" }}
              >
                98
              </p>
              <p className="mt-2 text-xs text-muted-foreground uppercase tracking-widest">
                Preview scorebug · 1920×1080
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-6"
            >
              <Icon className="mb-4 h-5 w-5 text-primary" />
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold">URLs legacy (vanilla)</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Los archivos HTML originales siguen en la raíz del workspace para compatibilidad OBS existente.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-mono text-muted-foreground">
            <li>index.html — landing legacy</li>
            <li>marcador_nba.html — panel + overlays NBA</li>
            <li>marcador_mlb_v4.html — panel + overlays MLB</li>
          </ul>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Stream Sports · No afiliado a ESPN · Room ID privado recomendado
      </footer>
    </div>
  );
}

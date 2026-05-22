"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppNav, PageMain, PageShell, SurfaceCard } from "@/components/ui/design-system";

export default function LandingPage() {
  return (
    <PageShell>
      <AppNav>
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <Link href="/settings" className="hover:text-zinc-200 transition-colors">
            Ajustes
          </Link>
        </div>
      </AppNav>

      <PageMain className="pt-4">
        <section className="pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-50 md:text-5xl"
          >
            Overlays deportivos para OBS, sin fricción.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="mt-4 max-w-lg text-base text-zinc-500"
          >
            Editor visual, datos ESPN en vivo y sync por sala. NBA y MLB en 1920×1080.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/dashboard/nba">
                Abrir NBA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg border-zinc-700">
              <Link href="/dashboard/mlb">Abrir MLB</Link>
            </Button>
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/nba" className="block group">
            <SurfaceCard hover className="min-h-[200px] flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-blue-500 mb-2">NBA</p>
                <h2 className="text-2xl font-semibold text-zinc-100 group-hover:text-white">
                  Scorebug, quinteto, cancha
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Smart slots, rotaciones ESPN y URLs por widget.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center text-sm text-blue-400">
                Ver partidos <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </SurfaceCard>
          </Link>
          <Link href="/dashboard/mlb" className="block group">
            <SurfaceCard hover className="min-h-[200px] flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-blue-500 mb-2">MLB</p>
                <h2 className="text-2xl font-semibold text-zinc-100 group-hover:text-white">
                  Marcador, bases, campo
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Line score, roster y plantilla de campo completa.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center text-sm text-blue-400">
                Ver partidos <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </SurfaceCard>
          </Link>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Layers, title: "Editor canvas", desc: "Arrastra, agrupa y guarda layout." },
            { icon: Radio, title: "ESPN live", desc: "Proxy sin CORS, polling automático." },
            { icon: ArrowRight, title: "OBS listo", desc: "Una URL por widget o escena completa." },
          ].map(({ icon: Icon, title, desc }) => (
            <SurfaceCard key={title} className="p-5">
              <Icon className="h-5 w-5 text-blue-500 mb-3" />
              <h3 className="text-sm font-medium text-zinc-200">{title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{desc}</p>
            </SurfaceCard>
          ))}
        </section>
      </PageMain>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
        Stream Sports · Self-hosted · Next.js 15
      </footer>
    </PageShell>
  );
}

"use client";

import { motion } from "framer-motion";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
}

export function MlbTicker({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.mlbGame);
  const plays = game.lastPlays ?? [];
  if (!shouldShowWidget(widgetFilter, "play-ticker")) return null;
  if (!plays.length) return null;

  const text = plays.map((p) => (p.inning ? `[${p.inning}] ${p.text}` : p.text)).join("  ·  ");

  return (
    <MovableLayer
      id="play-ticker"
      className="w-[900px] overflow-hidden rounded-md border border-white/10 bg-black/90"
    >
      <motion.div
        className="whitespace-nowrap px-4 py-2 text-sm text-white/90"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <span className="mr-12 text-[#c9a227] uppercase text-xs tracking-widest">Última jugada</span>
        {text}
        <span className="mx-12">{text}</span>
      </motion.div>
    </MovableLayer>
  );
}

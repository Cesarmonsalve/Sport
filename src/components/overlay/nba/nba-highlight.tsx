"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
}

export function NbaHighlight({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.nbaGame);
  const player = game.featuredPlayer;
  if (!shouldShowWidget(widgetFilter, "destacado-widget")) return null;
  if (!player) return null;

  return (
    <MovableLayer id="destacado-widget">
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 rounded-lg bg-gradient-to-l from-[#e11d48]/90 to-transparent pl-4 pr-6 py-2"
      >
        {player.headshot && (
          <Image
            src={player.headshot}
            alt={player.name}
            width={64}
            height={64}
            className="rounded-md object-cover"
            unoptimized
          />
        )}
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-300">
            Jugador destacado
          </span>
          <p
            className="text-2xl leading-none text-white"
            style={{ fontFamily: '"Bebas Neue", sans-serif' }}
          >
            {player.name}
          </p>
          <p className="text-sm text-white/80">
            {player.points ?? 0} PTS · {player.rebounds ?? 0} REB · {player.assists ?? 0} AST
          </p>
        </div>
      </motion.div>
    </MovableLayer>
  );
}

"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
}

export function NbaPlayerCard({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.nbaGame);
  const player = game.featuredPlayer;
  if (!shouldShowWidget(widgetFilter, "card-jugador")) return null;
  if (!player) return null;

  return (
    <MovableLayer
      id="card-jugador"
      className="flex gap-4 rounded-xl border border-white/15 bg-gradient-to-r from-black/90 to-black/70 px-5 py-4 backdrop-blur-md"
    >
      {player.headshot && (
        <Image
          src={player.headshot}
          alt={player.name}
          width={88}
          height={88}
          className="rounded-lg object-cover"
          unoptimized
        />
      )}
      <div className="flex flex-col justify-center">
        <span className="text-xs uppercase tracking-widest text-[#00b8d4]">
          {game.homeAbbr} · #{player.jersey}
        </span>
        <span
          className="text-3xl leading-tight"
          style={{ fontFamily: '"Bebas Neue", sans-serif' }}
        >
          {player.name}
        </span>
        <div className="mt-2 flex gap-4 text-sm text-white/80">
          <span>
            <strong className="text-white">{player.points ?? 0}</strong> PTS
          </span>
          <span>
            <strong className="text-white">{player.rebounds ?? 0}</strong> REB
          </span>
          <span>
            <strong className="text-white">{player.assists ?? 0}</strong> AST
          </span>
        </div>
      </div>
    </MovableLayer>
  );
}

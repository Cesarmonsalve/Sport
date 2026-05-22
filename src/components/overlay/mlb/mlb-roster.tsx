"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";
import type { MlbPlayer } from "@/types";

interface Props {
  widgetFilter?: string | null;
}

function RosterCol({ title, players }: { title: string; players: MlbPlayer[] }) {
  return (
    <div className="w-[140px]">
      <p className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{title}</p>
      <ul className="space-y-0.5">
        {players.slice(0, 12).map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-2 rounded px-1 py-0.5 text-[11px] hover:bg-white/5"
          >
            {p.headshot ? (
              <Image src={p.headshot} alt="" width={20} height={20} className="rounded-full" unoptimized />
            ) : (
              <span className="h-5 w-5 rounded-full bg-white/10" />
            )}
            <span className="text-white/40 w-4">#{p.jersey}</span>
            <span className="truncate flex-1 text-white/90">{p.name}</span>
            <span className="text-white/40">{p.position}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MlbRoster({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.mlbGame);
  if (!shouldShowWidget(widgetFilter, "roster-widget")) return null;

  const away = game.rosterAway ?? [];
  const home = game.rosterHome ?? [];
  if (!away.length && !home.length) return null;

  return (
    <MovableLayer
      id="roster-widget"
      className="flex gap-4 rounded-lg border border-white/10 bg-black/80 px-3 py-2 backdrop-blur-sm"
    >
      <RosterCol title={game.awayAbbr} players={away} />
      <div className="w-px bg-white/10" />
      <RosterCol title={game.homeAbbr} players={home} />
    </MovableLayer>
  );
}

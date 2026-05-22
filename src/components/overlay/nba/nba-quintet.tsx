"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";
import type { NbaPlayer } from "@/types";

interface Props {
  widgetFilter?: string | null;
}

function PlayerSlot({ p, abbr }: { p: NbaPlayer; abbr: string }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[72px]">
      {p.headshot ? (
        <Image
          src={p.headshot}
          alt={p.name}
          width={56}
          height={56}
          className="rounded-full border-2 border-white/20 object-cover"
          unoptimized
        />
      ) : (
        <div className="h-14 w-14 rounded-full bg-white/10" />
      )}
      <span className="text-[10px] font-bold text-white/90">#{p.jersey}</span>
      <span className="text-[9px] text-center text-white/70 truncate w-full">
        {p.name.split(" ").pop()}
      </span>
      <span className="text-[8px] text-[#00b8d4]">{abbr}</span>
    </div>
  );
}

export function NbaQuintet({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.nbaGame);
  if (!shouldShowWidget(widgetFilter, "quinteto-widget")) return null;

  const home = game.onCourtHome ?? [];
  const away = game.onCourtAway ?? [];
  if (!home.length && !away.length) return null;

  return (
    <MovableLayer
      id="quinteto-widget"
      className="rounded-xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur-sm"
    >
      <p
        className="mb-2 text-xs uppercase tracking-widest text-white/50"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        En cancha
      </p>
      <div className="flex gap-3">
        <div>
          <p className="mb-1 text-[10px] text-[#e11d48]">{game.awayAbbr}</p>
          <div className="flex gap-1">
            {away.map((p) => (
              <PlayerSlot key={p.id} p={p} abbr={game.awayAbbr} />
            ))}
          </div>
        </div>
        <div className="w-px bg-white/15" />
        <div>
          <p className="mb-1 text-[10px] text-[#00b8d4]">{game.homeAbbr}</p>
          <div className="flex gap-1">
            {home.map((p) => (
              <PlayerSlot key={p.id} p={p} abbr={game.homeAbbr} />
            ))}
          </div>
        </div>
      </div>
    </MovableLayer>
  );
}

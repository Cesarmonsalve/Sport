"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import type { NbaPlayer } from "@/types";

interface Props {
  widgetFilter?: string | null;
}

function RosterRow({ p, pos, accent }: { p: NbaPlayer; pos: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-2 border-b border-white/10 py-1.5 last:border-0"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <span
        className="w-8 text-center text-[10px] font-bold rounded"
        style={{ backgroundColor: `${accent}33`, color: accent }}
      >
        {pos}
      </span>
      {p.headshot ? (
        <Image src={p.headshot} alt="" width={36} height={36} className="rounded object-cover" unoptimized />
      ) : (
        <div className="h-9 w-9 bg-white/10 rounded" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{p.name}</p>
        <p className="text-[10px] text-white/50">
          {p.points ?? 0}P {p.rebounds ?? 0}R {p.assists ?? 0}A
        </p>
      </div>
    </div>
  );
}

export const NbaQuintet = memo(function NbaQuintet({ widgetFilter }: Props) {
  const game = useEditorStore(selectNbaGame);
  if (!shouldShowWidget(widgetFilter, "quinteto-widget")) return null;

  const home = game.onCourtHome ?? [];
  const away = game.onCourtAway ?? [];
  if (!home.length && !away.length) return null;

  const positions = ["PG", "SG", "SF", "PF", "C"];

  return (
    <MovableLayer
      id="quinteto-widget"
      className="ss-roster-panel rounded-lg border border-[#1a5cff]/40 bg-black/85 backdrop-blur-md overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-white/10 bg-[#1a5cff]/20">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[#1a5cff]">
          Roster · {game.homeAbbr}
        </p>
      </div>
      <div className="px-2 py-1 max-h-[280px] overflow-hidden">
        {home.map((p, i) => (
          <RosterRow
            key={p.id}
            p={p}
            pos={p.position ?? positions[i] ?? "—"}
            accent="#1a5cff"
          />
        ))}
      </div>
      <div className="px-3 py-2 border-t border-b border-white/10 bg-[#ff7a00]/15">
        <p className="text-[10px] uppercase tracking-widest text-[#ff7a00]">{game.awayAbbr}</p>
      </div>
      <div className="px-2 py-1">
        {away.map((p, i) => (
          <RosterRow
            key={p.id}
            p={p}
            pos={p.position ?? positions[i] ?? "—"}
            accent="#ff7a00"
          />
        ))}
      </div>
    </MovableLayer>
  );
});

"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
}

export function MlbMatchup({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.mlbGame);
  if (!shouldShowWidget(widgetFilter, "matchup-widget")) return null;
  const { pitcher, batter } = game;
  if (!pitcher && !batter) return null;

  return (
    <MovableLayer
      id="matchup-widget"
      className="flex items-center gap-6 rounded-xl border border-white/10 bg-black/85 px-5 py-4 backdrop-blur-md"
    >
      {pitcher && (
        <div className="flex items-center gap-3">
          {pitcher.headshot && (
            <Image src={pitcher.headshot} alt={pitcher.name} width={72} height={72} className="rounded-lg" unoptimized />
          )}
          <div>
            <span className="text-[10px] uppercase text-white/50">Pitcher</span>
            <p className="text-xl" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              {pitcher.name}
            </p>
            <span className="text-xs text-white/60">#{pitcher.jersey}</span>
          </div>
        </div>
      )}
      <span className="text-2xl text-[#c9a227]" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        VS
      </span>
      {batter && (
        <div className="flex items-center gap-3">
          {batter.headshot && (
            <Image src={batter.headshot} alt={batter.name} width={72} height={72} className="rounded-lg" unoptimized />
          )}
          <div>
            <span className="text-[10px] uppercase text-white/50">Bateador</span>
            <p className="text-xl" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              {batter.name}
            </p>
            <span className="text-xs text-[#c9a227]">AVG {batter.avg ?? "—"}</span>
          </div>
        </div>
      )}
    </MovableLayer>
  );
}

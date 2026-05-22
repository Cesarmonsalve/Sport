"use client";

import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

interface Props {
  widgetFilter?: string | null;
}

function BaseDiamond({ first, second, third }: { first: boolean; second: boolean; third: boolean }) {
  const dot = (on: boolean, pos: string) => (
    <div
      className={cn(
        "absolute h-5 w-5 rotate-45 border border-white/30",
        on ? "bg-[#c9a227] border-[#c9a227]" : "bg-white/10",
        pos
      )}
    />
  );
  return (
    <div className="relative h-16 w-16">
      {dot(second, "left-1/2 top-0 -translate-x-1/2")}
      {dot(third, "left-0 top-1/2 -translate-y-1/2")}
      {dot(first, "right-0 top-1/2 -translate-y-1/2")}
    </div>
  );
}

export function MlbBases({ widgetFilter }: Props) {
  const game = useEditorStore((s) => s.mlbGame);
  if (!shouldShowWidget(widgetFilter, "bases-widget")) return null;

  const b = game.bases ?? { first: false, second: false, third: false };

  return (
    <MovableLayer
      id="bases-widget"
      className="flex items-center gap-4 rounded-lg border border-white/10 bg-black/80 px-4 py-3"
    >
      <BaseDiamond first={b.first} second={b.second} third={b.third} />
      <div className="flex gap-3 text-sm" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        <span>
          B <strong className="text-lg text-white">{game.balls ?? 0}</strong>
        </span>
        <span>
          S <strong className="text-lg text-white">{game.strikes ?? 0}</strong>
        </span>
        <span>
          O <strong className="text-lg text-[#c9a227]">{game.outs ?? 0}</strong>
        </span>
      </div>
    </MovableLayer>
  );
}

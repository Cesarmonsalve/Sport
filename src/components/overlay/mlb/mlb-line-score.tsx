"use client";

import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export function MlbLineScore({ widgetFilter, interactive = false }: Props) {
  const game = useEditorStore((s) => s.mlbGame);
  const ls = game.linescore;
  if (!shouldShowWidget(widgetFilter, "line-score")) return null;
  if (!ls) return null;

  const cols = ls.inningLabels.length;

  return (
    <MovableLayer
      id="line-score"
      className="rounded-lg border border-white/10 bg-black/85 px-3 py-2 backdrop-blur-sm inline-block"
      editable
      interactive={interactive}
    >
      <table className="text-center text-xs" style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
        <thead>
          <tr className="text-white/50">
            <th className="px-2 text-left">TEAM</th>
            {ls.inningLabels.map((inn) => (
              <th key={inn} className="w-6 px-1">
                {inn}
              </th>
            ))}
            <th className="px-2 text-[#c9a227]">R</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 text-left text-[#e11d48]">{game.awayAbbr}</td>
            {Array.from({ length: cols }, (_, i) => (
              <td key={i} className="px-1 text-white/90">
                {ls.away[i] ?? "—"}
              </td>
            ))}
            <td className="px-2 font-bold text-white">{game.scoreAway}</td>
          </tr>
          <tr>
            <td className="px-2 text-left text-[#00b8d4]">{game.homeAbbr}</td>
            {Array.from({ length: cols }, (_, i) => (
              <td key={i} className="px-1 text-white/90">
                {ls.home[i] ?? "—"}
              </td>
            ))}
            <td className="px-2 font-bold text-white">{game.scoreHome}</td>
          </tr>
        </tbody>
      </table>
    </MovableLayer>
  );
}

"use client";

import { memo, useEffect, useState } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";

interface SponsorTickerProps {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const SponsorTicker = memo(function SponsorTicker({
  widgetFilter,
  interactive = false,
}: SponsorTickerProps) {
  const visibility = useEditorStore((s) => s.visibility);
  const settings = useEditorStore((s) => s.widgetSettings["sponsor-ticker"]);
  const lines = settings?.sponsorLines?.length
    ? settings.sponsorLines
    : ["Patrocinador"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % lines.length), 6000);
    return () => clearInterval(t);
  }, [lines.length]);

  if (!widgetOnly(widgetFilter, ["sponsor-ticker"]) || visibility["sponsor-ticker"] === false) {
    return null;
  }

  return (
    <MovableLayer id="sponsor-ticker" editable interactive={interactive}>
      <div
        className="flex h-10 min-w-[320px] items-center justify-center rounded-md border border-[#c9a227]/40 bg-black/75 px-6 text-sm font-medium uppercase tracking-widest text-[#c9a227]"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        {lines[idx]}
      </div>
    </MovableLayer>
  );
});

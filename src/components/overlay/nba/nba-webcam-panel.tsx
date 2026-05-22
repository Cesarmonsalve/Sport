"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const NbaWebcamPanel = memo(function NbaWebcamPanel({
  widgetFilter,
  interactive = false,
}: Props) {
  if (!shouldShowWidget(widgetFilter, "webcam-panel")) return null;

  return (
    <MovableLayer
      id="webcam-panel"
      className="ss-webcam-frame ss-accent-home rounded-sm border-2 inline-block"
      editable
      interactive={interactive}
    >
      <div className="flex min-h-[120px] min-w-[200px] items-center justify-center bg-black/90 text-xs text-white/30 uppercase tracking-widest">
        Webcam / feed
      </div>
    </MovableLayer>
  );
});

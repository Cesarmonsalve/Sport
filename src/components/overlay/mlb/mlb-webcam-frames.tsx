"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

function Frame({
  id,
  label,
  accent,
  interactive,
}: {
  id: string;
  label: string;
  accent: string;
  interactive: boolean;
}) {
  return (
    <MovableLayer
      id={id}
      className={`ss-webcam-frame ${accent} rounded border-2 inline-block`}
      editable
      interactive={interactive}
    >
      <div className="flex min-h-[120px] min-w-[200px] items-center justify-center bg-black/90 text-xs text-white/30 uppercase tracking-widest">
        {label}
      </div>
    </MovableLayer>
  );
}

export const MlbWebcamFrames = memo(function MlbWebcamFrames({
  widgetFilter,
  interactive = false,
}: Props) {
  return (
    <>
      {shouldShowWidget(widgetFilter, "webcam-main") && (
        <Frame id="webcam-main" label="Webcam principal" accent="ss-accent-home" interactive={interactive} />
      )}
      {shouldShowWidget(widgetFilter, "webcam-secondary") && (
        <Frame id="webcam-secondary" label="Webcam 2" accent="ss-accent-away" interactive={interactive} />
      )}
    </>
  );
});

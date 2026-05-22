"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

interface Props {
  widgetFilter?: string | null;
}

function Frame({ id, label, accent }: { id: string; label: string; accent: string }) {
  return (
    <MovableLayer id={id} className={`ss-webcam-frame ${accent} rounded border-2`}>
      <div className="flex h-full w-full items-center justify-center bg-black/90 text-xs text-white/30 uppercase tracking-widest">
        {label}
      </div>
    </MovableLayer>
  );
}

export const MlbWebcamFrames = memo(function MlbWebcamFrames({ widgetFilter }: Props) {
  return (
    <>
      {shouldShowWidget(widgetFilter, "webcam-main") && (
        <Frame id="webcam-main" label="Webcam principal" accent="ss-accent-home" />
      )}
      {shouldShowWidget(widgetFilter, "webcam-secondary") && (
        <Frame id="webcam-secondary" label="Webcam 2" accent="ss-accent-away" />
      )}
    </>
  );
});

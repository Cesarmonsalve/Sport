"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

interface Props {
  widgetFilter?: string | null;
}

export const NbaSocialFooter = memo(function NbaSocialFooter({ widgetFilter }: Props) {
  if (!shouldShowWidget(widgetFilter, "social-footer")) return null;

  return (
    <MovableLayer id="social-footer" className="ss-social-footer">
      <div className="flex h-full w-full items-center gap-6 border-t border-white/10 bg-black/80 px-8 text-white/70 text-sm">
        <span>@streamer</span>
        <span className="opacity-60">·</span>
        <span>TikTok</span>
        <span>Instagram</span>
        <span>YouTube</span>
      </div>
    </MovableLayer>
  );
});

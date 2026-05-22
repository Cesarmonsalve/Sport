"use client";

import { memo } from "react";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { shouldShowWidget } from "@/lib/overlay/widget-filter";

interface Props {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const NbaSocialFooter = memo(function NbaSocialFooter({
  widgetFilter,
  interactive = false,
}: Props) {
  if (!shouldShowWidget(widgetFilter, "social-footer")) return null;

  return (
    <MovableLayer id="social-footer" className="ss-social-footer inline-block" editable interactive={interactive}>
      <div className="flex min-h-[48px] min-w-[400px] items-center gap-6 border-t border-white/10 bg-black/80 px-8 text-white/70 text-sm">
        <span>@streamer</span>
        <span className="opacity-60">·</span>
        <span>TikTok</span>
        <span>Instagram</span>
        <span>YouTube</span>
      </div>
    </MovableLayer>
  );
});

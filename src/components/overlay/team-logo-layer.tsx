"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore } from "@/lib/store/editor-store";

interface TeamLogoLayerProps {
  id: "team-logo-home" | "team-logo-away" | "team-logo-h" | "team-logo-v";
  side: "home" | "away";
  interactive?: boolean;
  widgetFilter?: string | null;
}

export const TeamLogoLayer = memo(function TeamLogoLayer({
  id,
  side,
  interactive = false,
  widgetFilter,
}: TeamLogoLayerProps) {
  const sport = useEditorStore((s) => s.sport);
  const game = useEditorStore((s) => s.sport === "nba" ? s.nbaGame : s.mlbGame);
  const elements = useEditorStore((s) => s.elements);
  const bindings = useEditorStore((s) => s.dataBindings);

  const legacyId = side === "home" ? "team-logo-h" : "team-logo-v";
  const layerId = id === legacyId || id === `team-logo-${side}` ? id : `team-logo-${side === "home" ? "home" : "away"}`;
  const binding = bindings[layerId] ?? bindings[legacyId];
  const useEspn = binding?.dataSource !== "manual";

  const espnUrl = side === "home" ? game.homeLogo : game.awayLogo;
  const override =
    side === "home"
      ? (game as { homeLogoOverride?: string }).homeLogoOverride
      : (game as { awayLogoOverride?: string }).awayLogoOverride;
  const custom = elements[layerId]?.imageUrl ?? elements[legacyId]?.imageUrl ?? binding?.manualImageUrl;
  const src = useEspn ? espnUrl ?? custom : custom ?? espnUrl;

  if (widgetFilter && widgetFilter !== layerId && widgetFilter !== legacyId) return null;
  if (!src) return null;

  return (
    <MovableLayer id={layerId} editable interactive={interactive} className="inline-block">
      <Image
        src={src}
        alt={side === "home" ? game.homeAbbr : game.awayAbbr}
        width={56}
        height={56}
        unoptimized
        className="object-contain"
        style={{
          width: elements[layerId]?.width ?? "56px",
          height: elements[layerId]?.height ?? "56px",
          objectFit: (elements[layerId]?.objectFit as React.CSSProperties["objectFit"]) ?? "contain",
        }}
        onError={() => {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[Stream Sports] Logo failed: ${src}`);
          }
        }}
      />
    </MovableLayer>
  );
});

"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { AnimatedScore } from "@/components/overlay/animated-score";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore, selectNbaGame } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

const SCOREBUG_IDS = [
  "nba-scorebug",
  "score-local",
  "score-visitante",
  "tiempo-cuarto",
  "shot-clock",
  "fouls-v",
  "fouls-h",
  "team-logo-v",
  "team-logo-h",
];

interface NbaScorebugProps {
  widgetFilter?: string | null;
  interactive?: boolean;
}

export const NbaScorebug = memo(function NbaScorebug({
  widgetFilter,
  interactive = false,
}: NbaScorebugProps) {
  const game = useEditorStore(selectNbaGame);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);

  if (!widgetOnly(widgetFilter, SCOREBUG_IDS)) return null;

  const show = (id: string) =>
    !widgetFilter || widgetFilter === id || widgetFilter === "nba-scorebug";

  const homeLogo = game.homeLogoOverride ?? elements["team-logo-h"]?.imageUrl ?? game.homeLogo;
  const awayLogo = game.awayLogoOverride ?? elements["team-logo-v"]?.imageUrl ?? game.awayLogo;
  const clockLabel = `${game.period} · ${game.clock}`;

  return (
    <MovableLayer
      id="nba-scorebug"
      className="ss-scorebug-group inline-block"
      editable
      interactive={interactive}
    >
      {show("team-logo-v") && awayLogo && (
        <MovableLayer id="team-logo-v" groupParent="nba-scorebug" editable interactive={interactive}>
          <Image src={awayLogo} alt={game.awayAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
      {show("score-visitante") && (
        <MovableLayer id="score-visitante" groupParent="nba-scorebug" editable interactive={interactive}>
          <AnimatedScore
            value={game.scoreAway}
            className="leading-none tracking-wide"
            style={{
              fontFamily: elements["score-visitante"]?.fontFamily ?? '"Bebas Neue", sans-serif',
              fontSize: elements["score-visitante"]?.fontSize ?? "96px",
              color: elements["score-visitante"]?.color ?? "#e11d48",
            }}
          />
        </MovableLayer>
      )}
      {show("fouls-v") && game.foulsAway != null && visibility["fouls-v"] !== false && (
        <MovableLayer id="fouls-v" groupParent="nba-scorebug" editable interactive={interactive}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "14px" }}>
            F {game.foulsAway}
          </span>
        </MovableLayer>
      )}
      {show("tiempo-cuarto") && (
        <MovableLayer id="tiempo-cuarto" groupParent="nba-scorebug" editable interactive={interactive}>
          <span
            style={{
              fontFamily: elements["tiempo-cuarto"]?.fontFamily ?? "Rajdhani, sans-serif",
              fontSize: elements["tiempo-cuarto"]?.fontSize ?? "28px",
              fontWeight: 600,
            }}
          >
            {clockLabel}
          </span>
        </MovableLayer>
      )}
      {show("shot-clock") && visibility["shot-clock"] !== false && (
        <MovableLayer id="shot-clock" groupParent="nba-scorebug" editable interactive={interactive}>
          <span
            className={cn(
              game.shotClock && parseInt(game.shotClock, 10) <= 6 && "animate-pulse"
            )}
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: elements["shot-clock"]?.fontSize ?? "36px",
              color: elements["shot-clock"]?.color ?? "#fbbf24",
            }}
          >
            {game.shotClock ?? "—"}
          </span>
        </MovableLayer>
      )}
      {show("score-local") && (
        <MovableLayer id="score-local" groupParent="nba-scorebug" editable interactive={interactive}>
          <AnimatedScore
            value={game.scoreHome}
            className="leading-none tracking-wide"
            style={{
              fontFamily: elements["score-local"]?.fontFamily ?? '"Bebas Neue", sans-serif',
              fontSize: elements["score-local"]?.fontSize ?? "96px",
              color: elements["score-local"]?.color ?? "#00b8d4",
            }}
          />
        </MovableLayer>
      )}
      {show("fouls-h") && game.foulsHome != null && visibility["fouls-h"] !== false && (
        <MovableLayer id="fouls-h" groupParent="nba-scorebug" editable interactive={interactive}>
          <span style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "14px" }}>
            F {game.foulsHome}
          </span>
        </MovableLayer>
      )}
      {show("team-logo-h") && homeLogo && (
        <MovableLayer id="team-logo-h" groupParent="nba-scorebug" editable interactive={interactive}>
          <Image src={homeLogo} alt={game.homeAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
    </MovableLayer>
  );
});

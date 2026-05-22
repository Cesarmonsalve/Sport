"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

const SCOREBUG_IDS = [
  "nba-scorebug",
  "score-local",
  "score-visitante",
  "tiempo-cuarto",
  "shot-clock",
  "fouls-v",
  "fouls-h",
  "bonus-v",
  "bonus-h",
  "team-logo-v",
  "team-logo-h",
];

interface NbaScorebugProps {
  widgetFilter?: string | null;
}

export function NbaScorebug({ widgetFilter }: NbaScorebugProps) {
  const game = useEditorStore((s) => s.nbaGame);
  const visibility = useEditorStore((s) => s.visibility);

  if (!widgetOnly(widgetFilter, SCOREBUG_IDS)) return null;

  const show = (id: string) =>
    !widgetFilter || widgetFilter === id || widgetFilter === "nba-scorebug";

  const clockLabel = `${game.period} · ${game.clock}`;

  return (
    <MovableLayer
      id="nba-scorebug"
      className="ss-scorebug-group"
      editable={!widgetFilter || widgetFilter === "nba-scorebug"}
    >
      {show("team-logo-v") && game.awayLogo && (
        <MovableLayer id="team-logo-v" groupParent="nba-scorebug">
          <Image src={game.awayLogo} alt={game.awayAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
      {show("score-visitante") && (
        <MovableLayer id="score-visitante" groupParent="nba-scorebug">
          <span
            className="leading-none tracking-wide text-[#e11d48]"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "96px" }}
          >
            {game.scoreAway}
          </span>
        </MovableLayer>
      )}
      {show("fouls-v") && game.foulsAway != null && visibility["fouls-v"] !== false && (
        <MovableLayer id="fouls-v" groupParent="nba-scorebug">
          <span className="text-xs text-white/60" style={{ fontFamily: "Rajdhani" }}>
            F {game.foulsAway}
            {game.bonusAway && <span className="ml-1 text-amber-400">BONUS</span>}
          </span>
        </MovableLayer>
      )}
      {show("tiempo-cuarto") && (
        <MovableLayer id="tiempo-cuarto" groupParent="nba-scorebug">
          <span
            className="uppercase tracking-wider text-[#e8eaef]"
            style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 600 }}
          >
            {clockLabel}
          </span>
        </MovableLayer>
      )}
      {show("shot-clock") && visibility["shot-clock"] !== false && (
        <MovableLayer id="shot-clock" groupParent="nba-scorebug">
          <span
            className={cn(
              "leading-none text-[#fbbf24]",
              game.shotClock && parseInt(game.shotClock, 10) <= 6 && "animate-pulse"
            )}
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "36px" }}
          >
            {game.shotClock ?? "—"}
          </span>
        </MovableLayer>
      )}
      {show("score-local") && (
        <MovableLayer id="score-local" groupParent="nba-scorebug">
          <span
            className="leading-none tracking-wide text-[#00b8d4]"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "96px" }}
          >
            {game.scoreHome}
          </span>
        </MovableLayer>
      )}
      {show("fouls-h") && game.foulsHome != null && visibility["fouls-h"] !== false && (
        <MovableLayer id="fouls-h" groupParent="nba-scorebug">
          <span className="text-xs text-white/60" style={{ fontFamily: "Rajdhani" }}>
            F {game.foulsHome}
            {game.bonusHome && <span className="ml-1 text-amber-400">BONUS</span>}
          </span>
        </MovableLayer>
      )}
      {show("team-logo-h") && game.homeLogo && (
        <MovableLayer id="team-logo-h" groupParent="nba-scorebug">
          <Image src={game.homeLogo} alt={game.homeAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
    </MovableLayer>
  );
}

"use client";

import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore } from "@/lib/store/editor-store";
import { cn } from "@/lib/utils";

interface NbaScorebugProps {
  widgetFilter?: string | null;
}

export function NbaScorebug({ widgetFilter }: NbaScorebugProps) {
  const game = useEditorStore((s) => s.nbaGame);
  const visibility = useEditorStore((s) => s.visibility);

  if (widgetFilter && widgetFilter !== "nba-scorebug" && !widgetFilter.startsWith("score-") && widgetFilter !== "tiempo-cuarto" && widgetFilter !== "shot-clock") {
    if (!["score-local", "score-visitante", "tiempo-cuarto", "shot-clock", "fouls-v", "fouls-h", "bonus-v", "bonus-h", "team-logo-v", "team-logo-h"].includes(widgetFilter)) {
      return null;
    }
  }

  const show = (id: string) => !widgetFilter || widgetFilter === id || widgetFilter === "nba-scorebug";

  const clockLabel = `${game.period} · ${game.clock}`;

  return (
    <MovableLayer id="nba-scorebug" className="ss-scorebug-group" editable={!widgetFilter || widgetFilter === "nba-scorebug"}>
      {show("score-local") && (
        <MovableLayer id="score-local" groupParent="nba-scorebug">
          <span
            className="font-[family-name:var(--font-bebas)] leading-none tracking-wide"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "96px", color: "#00b8d4" }}
          >
            {game.scoreHome}
          </span>
        </MovableLayer>
      )}
      {show("score-visitante") && (
        <MovableLayer id="score-visitante" groupParent="nba-scorebug">
          <span
            className="leading-none tracking-wide"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "96px", color: "#e11d48" }}
          >
            {game.scoreAway}
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
      {show("shot-clock") && visibility["shot-clock"] !== false && game.shotClock && (
        <MovableLayer id="shot-clock" groupParent="nba-scorebug">
          <span
            className={cn(
              "leading-none",
              parseInt(game.shotClock, 10) <= 6 && "text-amber-400 animate-pulse"
            )}
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: "36px" }}
          >
            {game.shotClock}
          </span>
        </MovableLayer>
      )}
      {show("team-logo-h") && game.homeLogo && (
        <MovableLayer id="team-logo-h" groupParent="nba-scorebug">
          <Image src={game.homeLogo} alt={game.homeAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
      {show("team-logo-v") && game.awayLogo && (
        <MovableLayer id="team-logo-v" groupParent="nba-scorebug">
          <Image src={game.awayLogo} alt={game.awayAbbr} width={48} height={48} unoptimized />
        </MovableLayer>
      )}
    </MovableLayer>
  );
}

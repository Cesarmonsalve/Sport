"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { widgetOnly } from "@/lib/overlay/widget-filter";
import { useEditorStore } from "@/lib/store/editor-store";
import { useEspnPoll } from "@/hooks/use-espn-poll";
import { useEspnLeaders, useEspnNews, useEspnStandings } from "@/hooks/use-espn-dashboard";
import type { Sport, TickerSlide } from "@/types";

interface BroadcastTickerProps {
  sport: Sport;
  widgetFilter?: string | null;
  interactive?: boolean;
  standalone?: boolean;
}

function parseHeadlines(data: unknown): string[] {
  const d = data as { articles?: { headline?: string }[] };
  return (d?.articles ?? [])
    .map((a) => a.headline)
    .filter((h): h is string => Boolean(h))
    .slice(0, 5);
}

type StandingsEntry = {
  team?: { displayName?: string };
  stats?: { summary?: string }[];
};

function parseStandingsLine(data: unknown, sport: Sport): string {
  const d = data as {
    children?: { standings?: { entries?: StandingsEntry[] } }[];
  };
  const entries: StandingsEntry[] = d?.children?.[0]?.standings?.entries ?? [];
  const top = entries.slice(0, 3);
  if (!top.length) return `Tabla ${sport.toUpperCase()} — ESPN`;
  return top
    .map((e, i) => `${i + 1}. ${e.team?.displayName ?? "?"} ${e.stats?.[0]?.summary ?? ""}`)
    .join(" · ");
}

function parseLeadersLine(data: unknown, sport: Sport): string {
  const d = data as {
    leaders?: { displayName?: string; leaders?: { displayName?: string; value?: number }[] }[];
  };
  const cat = d?.leaders?.[0];
  const leader = cat?.leaders?.[0];
  if (!leader) return `Líderes ${sport.toUpperCase()}`;
  return `${cat?.displayName ?? "Líder"}: ${leader.displayName} (${leader.value ?? "—"})`;
}

export const BroadcastTicker = memo(function BroadcastTicker({
  sport,
  widgetFilter,
  interactive = false,
  standalone = false,
}: BroadcastTickerProps) {
  const id = "broadcast-ticker";
  const tickerSlides = useEditorStore((s) => s.tickerSlides);
  const brandKit = useEditorStore((s) => s.brandKit);
  const { events } = useEspnPoll(sport);
  const standings = useEspnStandings(sport);
  const leaders = useEspnLeaders(sport);
  const news = useEspnNews(sport);
  const [index, setIndex] = useState(0);

  const messages = useMemo(() => {
    const out: string[] = [];
    const enabled = tickerSlides.filter((s) => s.enabled);
    for (const slide of enabled) {
      switch (slide.type) {
        case "game_score": {
          const live = events.filter((e) => e.state === "in").slice(0, 4);
          if (live.length) {
            live.forEach((ev) =>
              out.push(`🔴 ${ev.shortName || ev.name} — ${ev.status}`)
            );
          } else {
            out.push("Sin partidos en vivo — ESPN scoreboard");
          }
          break;
        }
        case "standings":
          if (standings.data) out.push(parseStandingsLine(standings.data, sport));
          break;
        case "stat_leader":
          if (leaders.data) out.push(parseLeadersLine(leaders.data, sport));
          break;
        case "news":
          parseHeadlines(news.data).forEach((h) => out.push(h));
          break;
        case "sponsor":
          brandKit.sponsorSlots.forEach((s) => {
            out.push(s.tagline ? `${s.name}: ${s.tagline}` : s.name);
          });
          break;
        case "custom":
          if (slide.data?.text) out.push(String(slide.data.text));
          break;
      }
    }
    return out.length ? out : ["Stream Sports — Broadcast ticker"];
  }, [tickerSlides, events, standings.data, leaders.data, news.data, brandKit, sport]);

  const activeSlide = tickerSlides.filter((s) => s.enabled)[index % Math.max(1, tickerSlides.filter((s) => s.enabled).length)] as TickerSlide | undefined;
  const durationMs = (activeSlide?.duration ?? 8) * 1000;

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % messages.length), durationMs);
    return () => clearInterval(t);
  }, [messages.length, durationMs]);

  const text = messages[index % messages.length] ?? messages[0];
  const sponsor = brandKit.sponsorSlots[0];

  if (!standalone && !widgetOnly(widgetFilter, [id, "sponsor-ticker"])) return null;

  const inner = (
    <div
      className="ss-broadcast-ticker w-full"
      style={{ borderTopColor: brandKit.primaryColor }}
    >
      {sponsor?.logoUrl ? (
        <Image
          src={sponsor.logoUrl}
          alt={sponsor.name}
          width={40}
          height={40}
          unoptimized
          className="ml-4 shrink-0"
        />
      ) : null}
      <div className="ss-broadcast-ticker-track px-6 text-sm font-medium tracking-wide">
        {text}
      </div>
    </div>
  );

  if (standalone) return inner;

  return (
    <MovableLayer id={id} className="w-full left-0 right-0" editable interactive={interactive}>
      {inner}
    </MovableLayer>
  );
});

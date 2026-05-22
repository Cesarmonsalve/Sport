import type { BrandKit, TickerSlide } from "@/types";

export const DEFAULT_BRAND_KIT: BrandKit = {
  primaryColor: "#3b82f6",
  secondaryColor: "#1a1d26",
  accentColor: "#00b8d4",
  fontDisplay: "Barlow Condensed",
  fontBody: "Barlow",
  sponsorSlots: [
    {
      id: "sponsor-1",
      name: "Patrocinador A",
      logoUrl: "",
      tagline: "Patrocina tu stream",
      duration: 8,
    },
  ],
};

export const DEFAULT_TICKER_SLIDES: TickerSlide[] = [
  { type: "game_score", duration: 8, enabled: true },
  { type: "standings", duration: 10, enabled: true },
  { type: "stat_leader", duration: 8, enabled: true },
  { type: "news", duration: 10, enabled: true },
  { type: "sponsor", duration: 6, enabled: true },
  { type: "custom", duration: 6, enabled: false, data: { text: "Stream Sports" } },
];

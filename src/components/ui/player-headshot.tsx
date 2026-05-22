"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SILHOUETTE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="%23666"><circle cx="32" cy="22" r="12"/><path d="M8 58c4-14 16-22 24-22s20 8 24 22z"/></svg>`
  );

interface PlayerHeadshotProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  rounded?: "full" | "md" | "none";
  sport?: "nba" | "mlb";
}

export const PlayerHeadshot = memo(function PlayerHeadshot({
  src,
  alt = "",
  size = 40,
  className,
  rounded = "full",
  sport = "nba",
}: PlayerHeadshotProps) {
  const [url, setUrl] = useState(src);
  const [retries, setRetries] = useState(0);

  const onError = useCallback(() => {
    if (process.env.NODE_ENV === "development" && src) {
      console.warn(`[Stream Sports] Headshot failed: ${src}`);
    }
    if (retries < 1 && src?.includes("espncdn.com")) {
      setRetries(1);
      setUrl(src.replace("/full/", "/medium/"));
      return;
    }
    setUrl(SILHOUETTE);
  }, [src, retries]);

  const roundClass =
    rounded === "full" ? "rounded-full" : rounded === "md" ? "rounded-md" : "";

  if (!url) {
    return (
      <div
        className={cn("bg-white/10 shrink-0", roundClass, className)}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={cn("object-cover shrink-0", roundClass, className)}
      onError={onError}
      data-sport={sport}
    />
  );
});

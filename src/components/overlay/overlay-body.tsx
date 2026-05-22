"use client";

import { useEffect } from "react";

/** OBS requires transparent page background outside the 1920×1080 canvas */
export function OverlayBodyReset() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    html.style.background = "transparent";
    body.style.background = "transparent";
    body.style.margin = "0";
    body.style.overflow = "hidden";
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, []);
  return null;
}

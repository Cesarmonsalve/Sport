"use client";

import { Suspense } from "react";
import { BroadcastTicker } from "@/components/overlay/shared/broadcast-ticker";
import { OverlaySyncBootstrap } from "@/components/overlay/overlay-sync-bootstrap";

function Inner() {
  return (
    <div className="ss-overlay-root">
      <OverlaySyncBootstrap sport="mlb" />
      <BroadcastTicker sport="mlb" standalone />
    </div>
  );
}

export default function MlbTickerOverlayPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

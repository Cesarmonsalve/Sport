"use client";

import { Suspense } from "react";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
import { OverlaySyncBootstrap } from "@/components/overlay/overlay-sync-bootstrap";

function OverlayNbaInner() {
  return (
    <>
      <OverlaySyncBootstrap sport="nba" />
      <OverlayCanvas sport="nba" scale={1} interactive={false} />
    </>
  );
}

export default function OverlayNbaPage() {
  return (
    <Suspense fallback={null}>
      <OverlayNbaInner />
    </Suspense>
  );
}

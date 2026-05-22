"use client";

import { Suspense } from "react";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
import { OverlaySyncBootstrap } from "@/components/overlay/overlay-sync-bootstrap";

function OverlayMlbInner() {
  return (
    <>
      <OverlaySyncBootstrap sport="mlb" />
      <OverlayCanvas sport="mlb" scale={1} interactive={false} />
    </>
  );
}

export default function OverlayMlbPage() {
  return (
    <Suspense fallback={null}>
      <OverlayMlbInner />
    </Suspense>
  );
}

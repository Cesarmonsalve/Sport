"use client";

import { Suspense } from "react";
import { OverlayCanvas } from "@/components/overlay/overlay-canvas";
import { OverlaySyncBootstrap } from "@/components/overlay/overlay-sync-bootstrap";
import type { Sport } from "@/types";

interface OverlayWidgetPageProps {
  sport: Sport;
  widget: string;
}

function Inner({ sport, widget }: OverlayWidgetPageProps) {
  return (
    <>
      <OverlaySyncBootstrap sport={sport} />
      <OverlayCanvas
        sport={sport}
        scale={1}
        interactive={false}
        widgetFilter={widget}
      />
    </>
  );
}

export function OverlayWidgetPage({ sport, widget }: OverlayWidgetPageProps) {
  return (
    <Suspense fallback={null}>
      <Inner sport={sport} widget={widget} />
    </Suspense>
  );
}

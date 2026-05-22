"use client";

import { InspectorPanel } from "@/components/editor/inspector-panel";
import type { Sport } from "@/types";

interface EditorInspectorProps {
  sport: Sport;
}

/** @deprecated use InspectorPanel — kept for imports */
export function EditorInspector({ sport }: EditorInspectorProps) {
  return <InspectorPanel sport={sport} />;
}

export { InspectorPanel };

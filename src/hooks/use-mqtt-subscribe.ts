"use client";

import { useStreamSync } from "@/hooks/use-stream-sync";

/** Subscribe-only MQTT sync (overlay / remote). */
export function useMqttSubscribe(room: string) {
  return useStreamSync(false, room);
}

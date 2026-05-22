"use client";

import { useEffect, useRef } from "react";
import { StreamSportsSyncClient } from "@/lib/sync/client";
import { useEditorStore } from "@/lib/store/editor-store";

export function useStreamSync(isPanel: boolean, room: string) {
  const clientRef = useRef<StreamSportsSyncClient | null>(null);
  const applyingRef = useRef(false);
  const importState = useEditorStore((s) => s.importState);
  const exportState = useEditorStore((s) => s.exportState);
  const setSyncStatus = useEditorStore((s) => s.setSyncStatus);
  const setRoom = useEditorStore((s) => s.setRoom);

  useEffect(() => {
    setRoom(room);
  }, [room, setRoom]);

  useEffect(() => {
    const client = new StreamSportsSyncClient(room, isPanel, {
      onState: (state) => {
        applyingRef.current = true;
        importState(state);
        requestAnimationFrame(() => {
          applyingRef.current = false;
        });
      },
      onStatus: (status, detail) =>
        setSyncStatus(`${status}${detail ? `: ${detail}` : ""}`),
    });
    clientRef.current = client;
    client.connect();
    return () => client.destroy();
  }, [room, isPanel, importState, setSyncStatus]);

  useEffect(() => {
    if (!isPanel) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (applyingRef.current) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        clientRef.current?.publish(exportState());
      }, 150);
    };
    const unsub = useEditorStore.subscribe(schedule);
    return () => {
      unsub();
      if (timer) clearTimeout(timer);
    };
  }, [isPanel, exportState]);

  return {
    publishNow: () => clientRef.current?.publishNow(exportState()),
  };
}

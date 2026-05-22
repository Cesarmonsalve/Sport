"use client";

import Link from "next/link";
import { Copy, RefreshCw, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store/editor-store";
import { appendRoomToPath } from "@/lib/sync/room";
import type { Sport } from "@/types";

interface EditorHeaderProps {
  sport: Sport;
  room: string;
}

export function EditorHeader({ sport, room }: EditorHeaderProps) {
  const designMode = useEditorStore((s) => s.designMode);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const editorMode = useEditorStore((s) => s.editorMode);
  const setEditorMode = useEditorStore((s) => s.setEditorMode);
  const syncStatus = useEditorStore((s) => s.syncStatus);

  const overlayUrl = appendRoomToPath(`/overlay/${sport}`, room);

  const copyOverlay = () => {
    void navigator.clipboard.writeText(
      typeof window !== "undefined"
        ? `${window.location.origin}${overlayUrl}`
        : overlayUrl
    );
  };

  const statusVariant =
    syncStatus.includes("connected") ? "success" : syncStatus.includes("local") ? "warning" : "secondary";

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card px-4">
      <Link href="/" className="text-sm font-semibold tracking-tight">
        Stream Sports
      </Link>
      <Badge variant="secondary" className="uppercase">
        {sport}
      </Badge>
      <Badge variant={statusVariant as "success"} className="font-mono text-[10px]">
        {room}
      </Badge>
      <Badge variant="secondary" className="text-[10px]">
        {syncStatus}
      </Badge>

      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="design-mode"
            checked={designMode}
            onCheckedChange={setDesignMode}
          />
          <Label htmlFor="design-mode" className="flex items-center gap-1 text-xs">
            <Palette className="h-3 w-3" />
            Modo diseño
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="adv-mode"
            checked={editorMode === "advanced"}
            onCheckedChange={(v) => setEditorMode(v ? "advanced" : "simple")}
          />
          <Label htmlFor="adv-mode" className="text-xs">
            Avanzado
          </Label>
        </div>
        <Button variant="outline" size="sm" onClick={copyOverlay}>
          <Copy className="h-3.5 w-3.5" />
          URL OBS
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={overlayUrl} target="_blank">
            <RefreshCw className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

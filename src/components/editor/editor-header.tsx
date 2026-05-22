"use client";

import Link from "next/link";
import { Copy, RefreshCw, Palette, ExternalLink, Unlock } from "lucide-react";
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

const NBA_WIDGETS = [
  { id: "nba-scorebug", label: "Scorebug" },
  { id: "quinteto-widget", label: "Quinteto" },
  { id: "court-positions-widget", label: "Cancha" },
  { id: "webcam-panel", label: "Webcam" },
];

const MLB_WIDGETS = [
  { id: "scoreboard", label: "Marcador" },
  { id: "field-positions-widget", label: "Campo" },
  { id: "matchup-widget", label: "Matchup" },
  { id: "webcam-main", label: "Webcam" },
];

export function EditorHeader({ sport, room }: EditorHeaderProps) {
  const designMode = useEditorStore((s) => s.designMode);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const freeEditMode = useEditorStore((s) => s.freeEditMode);
  const setFreeEditMode = useEditorStore((s) => s.setFreeEditMode);
  const moveAsBlock = useEditorStore((s) => s.moveAsBlock);
  const setMoveAsBlock = useEditorStore((s) => s.setMoveAsBlock);
  const syncStatus = useEditorStore((s) => s.syncStatus);
  const streamSafePreview = useEditorStore((s) => s.streamSafePreview);
  const setStreamSafePreview = useEditorStore((s) => s.setStreamSafePreview);
  const snapToElements = useEditorStore((s) => s.snapToElements);
  const setSnapToElements = useEditorStore((s) => s.setSnapToElements);

  const overlayBase = appendRoomToPath(`/overlay/${sport}`, room);
  const widgets = sport === "nba" ? NBA_WIDGETS : MLB_WIDGETS;

  const copyUrl = (path: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    void navigator.clipboard.writeText(url);
  };

  const statusVariant = syncStatus.includes("connected")
    ? "success"
    : syncStatus.includes("local")
      ? "warning"
      : "secondary";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 flex-wrap">
      <Link href="/" className="text-sm font-semibold shrink-0">
        Stream Sports
      </Link>
      <Badge variant="secondary" className="uppercase text-[10px]">
        {sport}
      </Badge>
      <Badge variant={statusVariant as "success"} className="font-mono text-[10px]">
        {room}
      </Badge>

      <div className="ml-auto flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2 py-1">
          <Unlock className="h-3 w-3 text-primary" />
          <Switch id="free-edit" checked={freeEditMode} onCheckedChange={setFreeEditMode} />
          <Label htmlFor="free-edit" className="text-xs font-medium">
            Edición libre
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <Switch
            id="move-block"
            checked={moveAsBlock}
            onCheckedChange={setMoveAsBlock}
            disabled={freeEditMode}
          />
          <Label htmlFor="move-block" className="text-xs text-muted-foreground">
            Mover como bloque
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <Switch
            id="stream-safe"
            checked={streamSafePreview}
            onCheckedChange={setStreamSafePreview}
          />
          <Label htmlFor="stream-safe" className="text-xs text-muted-foreground">
            Vista OBS
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <Switch
            id="snap-el"
            checked={snapToElements}
            onCheckedChange={setSnapToElements}
          />
          <Label htmlFor="snap-el" className="text-xs text-muted-foreground">
            Snap elementos
          </Label>
        </div>
        <div className="flex items-center gap-1.5">
          <Switch id="design-mode" checked={designMode} onCheckedChange={setDesignMode} />
          <Label htmlFor="design-mode" className="flex items-center gap-1 text-xs">
            <Palette className="h-3 w-3" />
            Mock
          </Label>
        </div>
        <Button variant="outline" size="sm" onClick={() => copyUrl(overlayBase)}>
          <Copy className="h-3.5 w-3.5" />
          OBS
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={overlayBase} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

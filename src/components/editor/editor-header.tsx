"use client";

import Link from "next/link";
import { Copy, RefreshCw, Palette, ExternalLink } from "lucide-react";
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
  { id: "card-jugador", label: "Tarjeta" },
  { id: "quinteto-widget", label: "Quinteto" },
  { id: "destacado-widget", label: "Destacado" },
];

const MLB_WIDGETS = [
  { id: "scoreboard", label: "Marcador" },
  { id: "line-score", label: "Line score" },
  { id: "bases-widget", label: "Bases" },
  { id: "matchup-widget", label: "Matchup" },
  { id: "roster-widget", label: "Roster" },
  { id: "play-ticker", label: "Ticker" },
];

export function EditorHeader({ sport, room }: EditorHeaderProps) {
  const designMode = useEditorStore((s) => s.designMode);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const editorMode = useEditorStore((s) => s.editorMode);
  const setEditorMode = useEditorStore((s) => s.setEditorMode);
  const syncStatus = useEditorStore((s) => s.syncStatus);

  const overlayBase = appendRoomToPath(`/overlay/${sport}`, room);
  const widgets = sport === "nba" ? NBA_WIDGETS : MLB_WIDGETS;

  const copyUrl = (path: string) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    void navigator.clipboard.writeText(url);
  };

  const statusVariant =
    syncStatus.includes("connected")
      ? "success"
      : syncStatus.includes("local")
        ? "warning"
        : "secondary";

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
      <Link href="/" className="text-sm font-semibold tracking-tight shrink-0">
        Stream Sports
      </Link>
      <Badge variant="secondary" className="uppercase shrink-0">
        {sport}
      </Badge>
      <Badge variant={statusVariant as "success"} className="font-mono text-[10px] shrink-0">
        {room}
      </Badge>
      <Badge variant="secondary" className="text-[10px] shrink-0 max-w-[120px] truncate">
        {syncStatus}
      </Badge>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1">
          {widgets.map((w) => (
            <Button
              key={w.id}
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] px-2"
              onClick={() =>
                copyUrl(
                  appendRoomToPath(`/overlay/${sport}/${w.id}`, room)
                )
              }
              title={`Ruta dedicada: /overlay/${sport}/${w.id}`}
            >
              {w.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="design-mode"
            checked={designMode}
            onCheckedChange={setDesignMode}
          />
          <Label htmlFor="design-mode" className="flex items-center gap-1 text-xs">
            <Palette className="h-3 w-3" />
            Diseño
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
        <Button variant="outline" size="sm" onClick={() => copyUrl(overlayBase)}>
          <Copy className="h-3.5 w-3.5" />
          OBS full
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={overlayBase} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`${overlayBase}&design=1`} target="_blank">
            <RefreshCw className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

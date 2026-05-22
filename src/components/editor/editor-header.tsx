"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Palette,
  Unlock,
  Settings,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
      <Link href="/" className="text-sm font-semibold shrink-0">
        Stream Sports
      </Link>
      <Badge variant="secondary" className="uppercase text-[10px]">
        {sport}
      </Badge>
      <Badge variant={statusVariant as "success"} className="font-mono text-[10px]">
        {room}
      </Badge>

      <Link
        href={`/dashboard/${sport}`}
        className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Partidos
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5">
          <Unlock className="h-3 w-3 text-primary" />
          <Switch id="free-edit" checked={freeEditMode} onCheckedChange={setFreeEditMode} />
          <Label htmlFor="free-edit" className="text-[10px] font-medium">
            Libre
          </Label>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1"
            onClick={() => setMenuOpen((o) => !o)}
          >
            Producción
            <ChevronDown className="h-3 w-3" />
          </Button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-card p-3 shadow-lg space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="stream-safe" className="text-xs">
                    Vista OBS
                  </Label>
                  <Switch
                    id="stream-safe"
                    checked={streamSafePreview}
                    onCheckedChange={setStreamSafePreview}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="snap-el" className="text-xs">
                    Snap elementos
                  </Label>
                  <Switch
                    id="snap-el"
                    checked={snapToElements}
                    onCheckedChange={setSnapToElements}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="move-block" className="text-xs">
                    Mover bloque
                  </Label>
                  <Switch
                    id="move-block"
                    checked={moveAsBlock}
                    onCheckedChange={setMoveAsBlock}
                    disabled={freeEditMode}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="design-mode" className="flex items-center gap-1 text-xs">
                    <Palette className="h-3 w-3" />
                    Mock
                  </Label>
                  <Switch id="design-mode" checked={designMode} onCheckedChange={setDesignMode} />
                </div>
                <div className="border-t border-border pt-2 flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-7"
                    asChild
                  >
                    <Link href="/settings">
                      <Settings className="h-3 w-3 mr-2" />
                      Ajustes
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={() => copyUrl(overlayBase)}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={overlayBase} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Palette,
  Settings,
  ChevronDown,
  LayoutDashboard,
  Undo2,
  Redo2,
  Smartphone,
  MoreHorizontal,
  Grid3x3,
  Save,
  RotateCcw,
} from "lucide-react";
import { ResetCanvasDialog } from "@/components/editor/reset-canvas-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store/editor-store";
import { appendRoomToPath } from "@/lib/sync/room";
import type { SnapMode, Sport } from "@/types";

interface EditorHeaderProps {
  sport: Sport;
  room: string;
}

export function EditorHeader({ sport, room }: EditorHeaderProps) {
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const designMode = useEditorStore((s) => s.designMode);
  const setDesignMode = useEditorStore((s) => s.setDesignMode);
  const freeEditMode = useEditorStore((s) => s.freeEditMode);
  const setFreeEditMode = useEditorStore((s) => s.setFreeEditMode);
  const moveAsBlock = useEditorStore((s) => s.moveAsBlock);
  const setMoveAsBlock = useEditorStore((s) => s.setMoveAsBlock);
  const syncStatus = useEditorStore((s) => s.syncStatus);
  const streamSafePreview = useEditorStore((s) => s.streamSafePreview);
  const setStreamSafePreview = useEditorStore((s) => s.setStreamSafePreview);
  const snapMode = useEditorStore((s) => s.snapMode);
  const setSnapMode = useEditorStore((s) => s.setSnapMode);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const historyIndex = useEditorStore((s) => s._historyIndex);
  const historyLen = useEditorStore((s) => s._history.length);
  const resetCanvasLayout = useEditorStore((s) => s.resetCanvasLayout);
  const savePositionsNow = useEditorStore((s) => s.savePositionsNow);

  const overlayBase = appendRoomToPath(`/overlay/${sport}`, room);
  const remoteUrl = appendRoomToPath("/remote", room);

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

  const DropdownBackdrop = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
  );

  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4">
      <Link
        href="/"
        className="text-sm font-medium tracking-tight text-zinc-100 hover:text-white"
      >
        Stream Sports
      </Link>
      <Badge variant="secondary" className="uppercase text-[10px] font-normal bg-zinc-800 text-zinc-400 border-0">
        {sport}
      </Badge>
      <Badge variant={statusVariant as "success"} className="font-mono text-[10px] bg-zinc-800/80 border-zinc-700">
        {room}
      </Badge>

      <Link
        href={`/dashboard/${sport}`}
        className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Partidos
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <div className="flex items-center gap-0.5 rounded-md border border-zinc-800 bg-zinc-900/50 p-0.5">
          <Switch
            id="free-edit"
            checked={freeEditMode}
            onCheckedChange={setFreeEditMode}
            className="scale-75"
          />
          <Label htmlFor="free-edit" className="text-[10px] text-zinc-400 pr-2 cursor-pointer">
            Libre
          </Label>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
          disabled={historyIndex <= 0}
          onClick={() => undo()}
          title="Deshacer"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
          disabled={historyIndex >= historyLen - 1}
          onClick={() => redo()}
          title="Rehacer"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 border-zinc-700 bg-zinc-900 text-xs text-zinc-200"
            onClick={() => {
              setCanvasOpen((o) => !o);
              setProdOpen(false);
            }}
          >
            Canvas
            <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
          {canvasOpen && (
            <>
              <DropdownBackdrop onClose={() => setCanvasOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-xl space-y-1">
                <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500">
                  Snap
                </p>
                {(["off", "grid", "elements", "both"] as SnapMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSnapMode(m)}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                      snapMode === m
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    <Grid3x3 className="h-3.5 w-3.5" />
                    {m === "off" ? "Off" : m === "grid" ? "Grid" : m === "elements" ? "Elementos" : "Ambos"}
                  </button>
                ))}
                <div className="my-1 border-t border-zinc-800" />
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                  onClick={() => {
                    savePositionsNow();
                    setCanvasOpen(false);
                  }}
                >
                  <Save className="h-3.5 w-3.5" />
                  Guardar posiciones
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                  onClick={() => {
                    setResetOpen(true);
                    setCanvasOpen(false);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reiniciar canvas
                </button>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400"
            onClick={() => {
              setProdOpen((o) => !o);
              setCanvasOpen(false);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          {prodOpen && (
            <>
              <DropdownBackdrop onClose={() => setProdOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="stream-safe" className="text-xs text-zinc-400">
                    Vista OBS
                  </Label>
                  <Switch
                    id="stream-safe"
                    checked={streamSafePreview}
                    onCheckedChange={setStreamSafePreview}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="move-block" className="text-xs text-zinc-400">
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
                  <Label htmlFor="design-mode" className="flex items-center gap-1 text-xs text-zinc-400">
                    <Palette className="h-3 w-3" />
                    Mock ESPN
                  </Label>
                  <Switch id="design-mode" checked={designMode} onCheckedChange={setDesignMode} />
                </div>
                <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
                  <Button variant="ghost" size="sm" className="justify-start text-xs h-8" asChild>
                    <Link href={remoteUrl} target="_blank">
                      <Smartphone className="h-3.5 w-3.5 mr-2" />
                      Remote
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-xs h-8" asChild>
                    <Link href="/settings">
                      <Settings className="h-3.5 w-3.5 mr-2" />
                      Ajustes
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400"
          onClick={() => copyUrl(overlayBase)}
          title="Copiar URL overlay"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400" asChild>
          <Link href={overlayBase} target="_blank">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ResetCanvasDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetCanvasLayout();
          setResetOpen(false);
        }}
      />
    </header>
  );
}

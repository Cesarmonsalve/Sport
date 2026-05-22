"use client";

import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store/editor-store";
import type { CanvasBackgroundPreset } from "@/types";

const PRESETS: { id: CanvasBackgroundPreset; label: string; url?: string }[] = [
  { id: "none", label: "Sin fondo" },
  {
    id: "arena",
    label: "Arena",
    url: "linear-gradient(180deg, #0a0e1a 0%, #1a2540 50%, #0d1220 100%)",
  },
  {
    id: "stadium",
    label: "Estadio",
    url: "radial-gradient(ellipse 90% 70% at 50% 100%, rgba(30,60,30,0.5) 0%, #060a08 75%)",
  },
];

export function CanvasBackgroundPanel() {
  const canvasBackground = useEditorStore((s) => s.canvasBackground);
  const setCanvasBackground = useEditorStore((s) => s.setCanvasBackground);
  const setBrandKit = useEditorStore((s) => s.setBrandKit);
  const fileRef = useRef<HTMLInputElement>(null);

  const bg = canvasBackground ?? { preset: "none" as const, darken: 0, blur: 0 };

  const applyPreset = (preset: CanvasBackgroundPreset, url?: string) => {
    setCanvasBackground({ preset, imageUrl: url, darken: bg.darken, blur: bg.blur });
    if (preset === "none") {
      setBrandKit({ backgroundImage: undefined, backgroundOpacity: 100, backgroundBlur: 0 });
    } else if (url) {
      setBrandKit({
        backgroundImage: url,
        backgroundOpacity: Math.max(20, 100 - (bg.darken ?? 0)),
        backgroundBlur: bg.blur ?? 0,
      });
    }
  };

  const onUpload = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCanvasBackground({
      preset: "custom",
      imageUrl: url,
      darken: bg.darken,
      blur: bg.blur,
    });
    setBrandKit({
      backgroundImage: url,
      backgroundOpacity: Math.max(20, 100 - (bg.darken ?? 0)),
      backgroundBlur: bg.blur ?? 0,
    });
  };

  return (
    <div className="space-y-3 p-2 border-t border-border">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">Entorno / Fondo</span>
      </div>
      <p className="text-[9px] text-muted-foreground">
        Solo editor. OBS usa overlay sin fondo salvo ?bg=1. Subidas locales no se sincronizan entre dispositivos.
      </p>

      <div className="grid grid-cols-3 gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`rounded border px-1 py-1.5 text-[9px] ${
              bg.preset === p.id ? "border-primary bg-primary/10" : "border-border"
            }`}
            onClick={() => applyPreset(p.id, p.url)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="w-full rounded border border-dashed border-border py-2 text-[10px] hover:bg-accent"
        onClick={() => fileRef.current?.click()}
      >
        Subir imagen local
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onUpload(e.target.files?.[0])}
      />

      <div className="space-y-1">
        <Label className="text-[10px]">Oscurecer overlay %</Label>
        <input
          type="range"
          min={0}
          max={80}
          value={bg.darken ?? 0}
          className="w-full"
          onChange={(e) => {
            const darken = Number(e.target.value);
            setCanvasBackground({ ...bg, darken });
            setBrandKit({
              backgroundOpacity: Math.max(15, 100 - darken),
            });
          }}
        />
        <span className="text-[9px] text-muted-foreground">{bg.darken ?? 0}%</span>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px]">Blur px</Label>
        <input
          type="range"
          min={0}
          max={24}
          value={bg.blur ?? 0}
          className="w-full"
          onChange={(e) => {
            const blur = Number(e.target.value);
            setCanvasBackground({ ...bg, blur });
            setBrandKit({ backgroundBlur: blur });
          }}
        />
        <span className="text-[9px] text-muted-foreground">{bg.blur ?? 0}px</span>
      </div>
    </div>
  );
}

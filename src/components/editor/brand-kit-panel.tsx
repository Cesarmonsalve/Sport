"use client";

import { useEffect, useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEditorStore } from "@/lib/store/editor-store";
import { DEFAULT_BRAND_KIT } from "@/lib/brand-kit/defaults";
import type { BrandKit, SponsorSlot } from "@/types";

interface PalettePreset {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
}

const PALETTE_PRESETS: PalettePreset[] = [
  { id: "broadcast", label: "Broadcast clásico", primary: "#3b82f6", secondary: "#0f172a", accent: "#00b8d4" },
  { id: "court", label: "NBA court", primary: "#1e40af", secondary: "#1a1d26", accent: "#fbbf24" },
  { id: "diamond", label: "MLB diamond", primary: "#dc2626", secondary: "#0a0e1a", accent: "#facc15" },
  { id: "esports", label: "Esports neón", primary: "#7c3aed", secondary: "#000010", accent: "#22d3ee" },
  { id: "night", label: "Night glass", primary: "#94a3b8", secondary: "#000000", accent: "#38bdf8" },
];

function ColorWithHex({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] capitalize">{label}</Label>
      <div className="flex items-center gap-1">
        <Input
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-9 p-0.5"
        />
        <Input
          className="h-8 text-[11px] font-mono"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function BrandKitPanel() {
  const brandKit = useEditorStore((s) => s.brandKit);
  const setBrandKit = useEditorStore((s) => s.setBrandKit);
  const bgFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("stream-sports-brand-kit");
      if (raw) setBrandKit(JSON.parse(raw) as BrandKit);
    } catch {
      /* ignore */
    }
  }, [setBrandKit]);

  const patchSponsor = (idx: number, patch: Partial<SponsorSlot>) => {
    const slots = [...brandKit.sponsorSlots];
    slots[idx] = { ...slots[idx]!, ...patch };
    setBrandKit({ sponsorSlots: slots });
  };

  const removeSponsor = (idx: number) => {
    const slots = brandKit.sponsorSlots.filter((_, i) => i !== idx);
    setBrandKit({ sponsorSlots: slots });
  };

  const uploadToDataUrl = (file: File | undefined, cb: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") cb(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const applyPalette = (p: PalettePreset) => {
    setBrandKit({ primaryColor: p.primary, secondaryColor: p.secondary, accentColor: p.accent });
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Marca del canal</h2>

        <div className="grid gap-2">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Paletas preconfiguradas
          </Label>
          <div className="grid grid-cols-2 gap-1">
            {PALETTE_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPalette(p)}
                className="flex items-center gap-2 rounded border border-border px-2 py-1.5 text-left text-[10px] hover:border-primary"
              >
                <span className="flex gap-0.5">
                  {[p.primary, p.secondary, p.accent].map((c) => (
                    <span
                      key={c}
                      className="h-3.5 w-3.5 rounded-sm border border-zinc-700"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <ColorWithHex label="primary" value={brandKit.primaryColor} onChange={(v) => setBrandKit({ primaryColor: v })} />
          <ColorWithHex label="secondary" value={brandKit.secondaryColor} onChange={(v) => setBrandKit({ secondaryColor: v })} />
          <ColorWithHex label="accent" value={brandKit.accentColor} onChange={(v) => setBrandKit({ accentColor: v })} />
        </div>

        <div className="grid gap-2">
          <Label className="text-xs">Fuente títulos</Label>
          <Input
            value={brandKit.fontDisplay}
            onChange={(e) => setBrandKit({ fontDisplay: e.target.value })}
            placeholder="Barlow Condensed"
          />
          <Label className="text-xs">Fuente cuerpo</Label>
          <Input
            value={brandKit.fontBody}
            onChange={(e) => setBrandKit({ fontBody: e.target.value })}
            placeholder="Barlow"
          />
          <Label className="text-xs">Logo URL</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              value={brandKit.logoUrl?.startsWith("data:") ? "(imagen local)" : brandKit.logoUrl ?? ""}
              onChange={(e) => setBrandKit({ logoUrl: e.target.value })}
              disabled={brandKit.logoUrl?.startsWith("data:")}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => logoFileRef.current?.click()}
              title="Subir logo local"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={logoFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => uploadToDataUrl(e.target.files?.[0], (url) => setBrandKit({ logoUrl: url }))}
            />
          </div>
        </div>

        <div className="grid gap-2 pt-4 border-t border-border mt-4">
          <h3 className="text-xs font-semibold">Fondo del Canvas</h3>
          <Label className="text-[10px]">Imagen Base (URL)</Label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              value={brandKit.backgroundImage?.startsWith("data:") ? "(imagen local)" : brandKit.backgroundImage ?? ""}
              onChange={(e) => setBrandKit({ backgroundImage: e.target.value })}
              placeholder="https://..."
              disabled={brandKit.backgroundImage?.startsWith("data:")}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => bgFileRef.current?.click()}
              title="Subir fondo local"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              ref={bgFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                uploadToDataUrl(e.target.files?.[0], (url) => setBrandKit({ backgroundImage: url }))
              }
            />
          </div>
          <Label className="text-[10px]">Video de Fondo (URL MP4)</Label>
          <Input
            value={brandKit.backgroundVideo ?? ""}
            onChange={(e) => setBrandKit({ backgroundVideo: e.target.value })}
            placeholder="https://..."
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px]">Desenfocar (Blur px)</Label>
              <Input
                type="number"
                value={brandKit.backgroundBlur ?? 0}
                onChange={(e) => setBrandKit({ backgroundBlur: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-[10px]">Opacidad (%)</Label>
              <Input
                type="number"
                value={brandKit.backgroundOpacity ?? 100}
                onChange={(e) => setBrandKit({ backgroundOpacity: parseInt(e.target.value) || 100 })}
              />
            </div>
          </div>
          <div className="mt-2">
            <Label className="text-[10px]">Variante de Diseño Global</Label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              value={brandKit.globalDesignVariant ?? "default"}
              onChange={(e) =>
                setBrandKit({
                  globalDesignVariant: e.target.value as "default" | "glass" | "neon" | "metallic",
                })
              }
            >
              <option value="default">Por Defecto</option>
              <option value="glass">Cristal (Glassmorphism)</option>
              <option value="neon">Neón Gamer</option>
              <option value="metallic">Metálico Deportivo</option>
            </select>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => setBrandKit(DEFAULT_BRAND_KIT)} className="w-full mt-4">
          Restaurar defaults
        </Button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-muted-foreground">Patrocinadores (ticker)</h3>
          <span className="text-[9px] text-muted-foreground">
            {brandKit.sponsorSlots.filter((s) => s.enabled !== false).length} activos
          </span>
        </div>
        {brandKit.sponsorSlots.map((slot, i) => (
          <div key={slot.id} className="rounded border border-border p-3 space-y-2 relative">
            <div className="flex items-center justify-between">
              <Label className="text-[10px]">Activo en ticker</Label>
              <Switch
                checked={slot.enabled !== false}
                onCheckedChange={(v) => patchSponsor(i, { enabled: v })}
              />
            </div>
            <Input
              value={slot.name}
              onChange={(e) => patchSponsor(i, { name: e.target.value })}
              placeholder="Nombre"
            />
            <Input
              value={slot.tagline ?? ""}
              onChange={(e) => patchSponsor(i, { tagline: e.target.value })}
              placeholder="Tagline"
            />
            <Input
              value={slot.logoUrl?.startsWith("data:") ? "(imagen local)" : slot.logoUrl}
              onChange={(e) => patchSponsor(i, { logoUrl: e.target.value })}
              placeholder="Logo URL"
              disabled={slot.logoUrl?.startsWith("data:")}
            />
            <div className="flex gap-2">
              <Input
                value={slot.link ?? ""}
                onChange={(e) => patchSponsor(i, { link: e.target.value })}
                placeholder="Link (opcional)"
                className="flex-1"
              />
              <Input
                type="number"
                value={slot.duration}
                onChange={(e) => patchSponsor(i, { duration: parseInt(e.target.value) || 8 })}
                placeholder="seg"
                className="w-20"
                min={2}
                max={60}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 h-7 text-[10px]"
                onClick={() => {
                  const inp = document.createElement("input");
                  inp.type = "file";
                  inp.accept = "image/*";
                  inp.onchange = () =>
                    uploadToDataUrl(inp.files?.[0] ?? undefined, (url) =>
                      patchSponsor(i, { logoUrl: url })
                    );
                  inp.click();
                }}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Subir logo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-red-400 hover:text-red-300"
                onClick={() => removeSponsor(i)}
                title="Eliminar sponsor"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setBrandKit({
              sponsorSlots: [
                ...brandKit.sponsorSlots,
                {
                  id: `sponsor-${Date.now()}`,
                  name: "Nuevo sponsor",
                  logoUrl: "",
                  duration: 8,
                  enabled: true,
                },
              ],
            })
          }
        >
          + Sponsor
        </Button>
      </section>
    </div>
  );
}

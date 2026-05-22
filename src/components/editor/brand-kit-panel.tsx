"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/lib/store/editor-store";
import { DEFAULT_BRAND_KIT } from "@/lib/brand-kit/defaults";
import type { BrandKit, SponsorSlot } from "@/types";

export function BrandKitPanel() {
  const brandKit = useEditorStore((s) => s.brandKit);
  const setBrandKit = useEditorStore((s) => s.setBrandKit);

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

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Marca del canal</h2>
        <div className="grid grid-cols-3 gap-2">
          {(["primaryColor", "secondaryColor", "accentColor"] as const).map((key) => (
            <div key={key}>
              <Label className="text-[10px] capitalize">{key.replace("Color", "")}</Label>
              <Input
                type="color"
                value={brandKit[key]}
                onChange={(e) => setBrandKit({ [key]: e.target.value })}
                className="h-9 p-1"
              />
            </div>
          ))}
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
          <Input
            value={brandKit.logoUrl ?? ""}
            onChange={(e) => setBrandKit({ logoUrl: e.target.value })}
          />
        </div>

        <div className="grid gap-2 pt-4 border-t border-border mt-4">
          <h3 className="text-xs font-semibold">Fondo del Canvas</h3>
          <Label className="text-[10px]">Imagen Base (URL)</Label>
          <Input
            value={brandKit.backgroundImage ?? ""}
            onChange={(e) => setBrandKit({ backgroundImage: e.target.value })}
            placeholder="https://..."
          />
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
              onChange={(e) => setBrandKit({ globalDesignVariant: e.target.value as any })}
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
        <h3 className="text-xs font-medium text-muted-foreground">Patrocinadores (ticker)</h3>
        {brandKit.sponsorSlots.map((slot, i) => (
          <div key={slot.id} className="rounded border border-border p-3 space-y-2">
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
              value={slot.logoUrl}
              onChange={(e) => patchSponsor(i, { logoUrl: e.target.value })}
              placeholder="Logo URL"
            />
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

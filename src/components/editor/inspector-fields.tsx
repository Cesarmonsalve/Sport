"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { ElementDataBinding, ElementStyle } from "@/types";

const FONTS = ["Bebas Neue", "Rajdhani", "Geist", "Arial", "Impact", "Oswald"];

interface FieldProps {
  id: string;
  style: ElementStyle;
  pos?: { left: string; top: string };
  binding?: ElementDataBinding;
  locked?: boolean;
  setStyle: (patch: ElementStyle) => void;
  setPos: (patch: { left?: string; top?: string }) => void;
  setBinding?: (b: ElementDataBinding) => void;
  setLocked?: (v: boolean) => void;
}

function NumInput({
  label,
  value,
  onChange,
  suffix = "px",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input
        className="h-7 text-xs"
        value={value.replace(suffix, "")}
        onChange={(e) => onChange(e.target.value ? `${e.target.value}${suffix}` : "")}
      />
    </div>
  );
}

export function InspectorLayoutTab({ id, style, pos, locked, setStyle, setPos, setLocked }: FieldProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumInput label="X" value={pos?.left ?? style.left ?? ""} onChange={(v) => setPos({ left: v })} />
      <NumInput label="Y" value={pos?.top ?? style.top ?? ""} onChange={(v) => setPos({ top: v })} />
      <NumInput label="Ancho" value={style.width ?? ""} onChange={(v) => setStyle({ width: v })} />
      <NumInput label="Alto" value={style.height ?? ""} onChange={(v) => setStyle({ height: v })} />
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px]">Rotación (deg)</Label>
        <Input
          className="h-7 text-xs"
          value={style.rotate?.replace("deg", "") ?? ""}
          onChange={(e) => setStyle({ rotate: e.target.value ? `${e.target.value}deg` : undefined })}
        />
      </div>
      <NumInput label="Padding" value={style.padding ?? ""} onChange={(v) => setStyle({ padding: v })} suffix="" />
      <NumInput label="Margin" value={style.margin ?? ""} onChange={(v) => setStyle({ margin: v })} suffix="" />
      <NumInput label="Gap" value={style.gap ?? ""} onChange={(v) => setStyle({ gap: v })} suffix="" />
      <div className="col-span-2 flex items-center justify-between">
        <Label className="text-xs">Bloquear posición</Label>
        <Switch checked={!!locked} onCheckedChange={(v) => setLocked?.(v)} />
      </div>
    </div>
  );
}

export function InspectorTypographyTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px]">Fuente</Label>
      <select
        className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
        value={style.fontFamily?.replace(/"/g, "") ?? "Bebas Neue"}
        onChange={(e) => setStyle({ fontFamily: e.target.value })}
      >
        {FONTS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <NumInput label="Tamaño texto" value={style.fontSize ?? ""} onChange={(v) => setStyle({ fontSize: v })} />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px]">Peso</Label>
          <Input
            className="h-7 text-xs"
            value={style.fontWeight ?? ""}
            onChange={(e) => setStyle({ fontWeight: e.target.value })}
            placeholder="700"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Alineación</Label>
          <select
            className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
            value={style.textAlign ?? "left"}
            onChange={(e) => setStyle({ textAlign: e.target.value })}
          >
            <option value="left">Izq</option>
            <option value="center">Centro</option>
            <option value="right">Der</option>
          </select>
        </div>
      </div>
      <NumInput
        label="Letter-spacing"
        value={style.letterSpacing ?? ""}
        onChange={(v) => setStyle({ letterSpacing: v })}
        suffix=""
      />
      <div className="space-y-1">
        <Label className="text-[10px]">Color texto</Label>
        <Input
          type="color"
          className="h-8 p-1"
          value={style.color?.startsWith("#") ? style.color : "#ffffff"}
          onChange={(e) => setStyle({ color: e.target.value })}
        />
      </div>
    </div>
  );
}

export function InspectorImageTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  return (
    <div className="space-y-2">
      <Label className="text-[10px]">URL imagen / logo</Label>
      <Input
        className="h-7 text-xs"
        value={style.imageUrl ?? ""}
        onChange={(e) => setStyle({ imageUrl: e.target.value })}
        placeholder="https://..."
      />
      <div className="space-y-1">
        <Label className="text-[10px]">Object-fit</Label>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
          value={style.objectFit ?? "cover"}
          onChange={(e) => setStyle({ objectFit: e.target.value })}
        >
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="fill">fill</option>
        </select>
      </div>
      <NumInput label="Border radius" value={style.borderRadius ?? ""} onChange={(v) => setStyle({ borderRadius: v })} />
    </div>
  );
}

export function InspectorColorsTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  return (
    <div className="space-y-2">
      {(["color", "backgroundColor", "borderColor", "accentColor"] as const).map((key) => (
        <div key={key} className="space-y-1">
          <Label className="text-[10px] capitalize">{key}</Label>
          <Input
            type="color"
            className="h-8 p-1"
            value={
              style[key]?.startsWith("#")
                ? style[key]
                : key === "backgroundColor"
                  ? "#000000"
                  : "#1a5cff"
            }
            onChange={(e) => setStyle({ [key]: e.target.value })}
          />
        </div>
      ))}
      <div className="space-y-1">
        <Label className="text-[10px]">Opacidad</Label>
        <Input
          type="range"
          min={0}
          max={100}
          value={Math.round((Number(style.opacity ?? 1) || 1) * 100)}
          onChange={(e) => setStyle({ opacity: String(Number(e.target.value) / 100) })}
        />
      </div>
      <NumInput label="Sombra (CSS)" value={style.boxShadow ?? ""} onChange={(v) => setStyle({ boxShadow: v })} suffix="" />
    </div>
  );
}

export function InspectorDataTab({
  binding,
  setBinding,
}: {
  binding?: ElementDataBinding;
  setBinding?: (b: ElementDataBinding) => void;
}) {
  if (!setBinding) return <p className="text-xs text-muted-foreground">Sin binding de datos.</p>;
  const b = binding ?? { dataSource: "espn" };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Fuente datos</Label>
        <select
          className="h-7 rounded border border-border bg-muted/50 text-xs px-2"
          value={b.dataSource}
          onChange={(e) =>
            setBinding({ ...b, dataSource: e.target.value as "espn" | "manual" })
          }
        >
          <option value="espn">ESPN en vivo</option>
          <option value="manual">Manual (override)</option>
        </select>
      </div>
      {b.dataSource === "manual" && (
        <>
          <Label className="text-[10px]">Nombre / texto manual</Label>
          <Input
            className="h-7 text-xs"
            value={b.manualText ?? ""}
            onChange={(e) => setBinding({ ...b, manualText: e.target.value })}
          />
          <Label className="text-[10px]">Foto manual URL</Label>
          <Input
            className="h-7 text-xs"
            value={b.manualImageUrl ?? ""}
            onChange={(e) => setBinding({ ...b, manualImageUrl: e.target.value })}
          />
        </>
      )}
      <p className="text-[10px] text-muted-foreground">
        ESPN actualiza jugador sin mover posición ni estilos del slot.
      </p>
    </div>
  );
}

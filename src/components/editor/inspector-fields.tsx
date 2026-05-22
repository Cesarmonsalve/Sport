"use client";

import { useMemo, useRef } from "react";
import { Bold, Italic, Underline } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store/editor-store";
import type { ElementDataBinding, ElementStyle } from "@/types";

interface FontOption {
  label: string;
  family: string;
  group: "Display" | "Sans" | "Serif" | "Mono";
}

const FONTS: FontOption[] = [
  { label: "Bebas Neue", family: "Bebas Neue", group: "Display" },
  { label: "Barlow Condensed", family: "Barlow Condensed", group: "Display" },
  { label: "Oswald", family: "Oswald", group: "Display" },
  { label: "Impact", family: "Impact", group: "Display" },
  { label: "Anton", family: "Anton", group: "Display" },
  { label: "Rajdhani", family: "Rajdhani", group: "Sans" },
  { label: "Geist", family: "Geist", group: "Sans" },
  { label: "Inter", family: "Inter", group: "Sans" },
  { label: "Barlow", family: "Barlow", group: "Sans" },
  { label: "Roboto", family: "Roboto", group: "Sans" },
  { label: "Arial", family: "Arial", group: "Sans" },
  { label: "System UI", family: "system-ui", group: "Sans" },
  { label: "Roboto Slab", family: "Roboto Slab", group: "Serif" },
  { label: "Playfair", family: "Playfair Display", group: "Serif" },
  { label: "Georgia", family: "Georgia", group: "Serif" },
  { label: "Geist Mono", family: "Geist Mono", group: "Mono" },
  { label: "JetBrains Mono", family: "JetBrains Mono", group: "Mono" },
  { label: "Courier", family: "Courier New", group: "Mono" },
];

const FONT_GROUPS: Array<FontOption["group"]> = ["Display", "Sans", "Serif", "Mono"];

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
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input
        className="h-7 text-xs"
        value={value.replace(suffix, "")}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value ? `${e.target.value}${suffix}` : "")}
      />
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
  fallback = "#ffffff",
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  fallback?: string;
}) {
  const brandKit = useEditorStore((s) => s.brandKit);
  const safe = value?.startsWith("#") ? value : fallback;
  return (
    <div className="space-y-1">
      <Label className="text-[10px] capitalize">{label}</Label>
      <div className="flex items-center gap-1">
        <Input type="color" className="h-7 w-9 p-0.5" value={safe} onChange={(e) => onChange(e.target.value)} />
        <Input
          className="h-7 text-[11px] font-mono flex-1"
          value={value ?? ""}
          placeholder={fallback}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        {(["primaryColor", "secondaryColor", "accentColor"] as const).map((k) => (
          <button
            key={k}
            type="button"
            title={`Aplicar ${k.replace("Color", "")} del brand kit`}
            onClick={() => onChange(brandKit[k])}
            className="h-4 w-4 rounded-sm border border-zinc-700"
            style={{ backgroundColor: brandKit[k] }}
          />
        ))}
      </div>
    </div>
  );
}

export function InspectorLayoutTab({ style, pos, locked, setStyle, setPos, setLocked }: FieldProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumInput label="X" value={pos?.left ?? style.left ?? ""} onChange={(v) => setPos({ left: v })} />
      <NumInput label="Y" value={pos?.top ?? style.top ?? ""} onChange={(v) => setPos({ top: v })} />
      <NumInput label="Ancho" value={style.width ?? ""} onChange={(v) => setStyle({ width: v })} />
      <NumInput label="Alto" value={style.height ?? ""} onChange={(v) => setStyle({ height: v })} />
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px]">Rotación (deg)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="range"
            min={-180}
            max={180}
            className="h-7 flex-1"
            value={parseFloat(style.rotate ?? "0") || 0}
            onChange={(e) => setStyle({ rotate: e.target.value ? `${e.target.value}deg` : undefined })}
          />
          <Input
            className="h-7 w-14 text-xs"
            value={style.rotate?.replace("deg", "") ?? ""}
            onChange={(e) => setStyle({ rotate: e.target.value ? `${e.target.value}deg` : undefined })}
          />
        </div>
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

function parseTextShadow(value: string | undefined): { x: number; y: number; blur: number; color: string } {
  if (!value) return { x: 0, y: 2, blur: 4, color: "#000000aa" };
  const colorMatch = value.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/);
  const color = colorMatch ? colorMatch[1] : "#000000aa";
  const nums = value
    .replace(colorMatch?.[1] ?? "", "")
    .trim()
    .split(/\s+/)
    .map((n) => parseFloat(n) || 0);
  return { x: nums[0] ?? 0, y: nums[1] ?? 2, blur: nums[2] ?? 4, color };
}

function composeTextShadow({ x, y, blur, color }: { x: number; y: number; blur: number; color: string }): string {
  return `${x}px ${y}px ${blur}px ${color}`;
}

export function InspectorTypographyTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  const currentFamily = style.fontFamily?.replace(/"/g, "") ?? "Bebas Neue";
  const shadow = parseTextShadow(style.textShadow);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-[10px]">Fuente</Label>
        <select
          className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
          value={currentFamily}
          onChange={(e) => setStyle({ fontFamily: e.target.value })}
        >
          {FONT_GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {FONTS.filter((f) => f.group === group).map((f) => (
                <option key={f.family} value={f.family} style={{ fontFamily: f.family }}>
                  {f.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div
          className="rounded border border-border bg-zinc-900/60 px-2 py-1.5 text-base text-zinc-200 truncate"
          style={{ fontFamily: currentFamily }}
        >
          AaBbCc 123 — {currentFamily}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumInput label="Tamaño" value={style.fontSize ?? ""} onChange={(v) => setStyle({ fontSize: v })} />
        <div className="space-y-1">
          <Label className="text-[10px]">Peso</Label>
          <select
            className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs px-2"
            value={style.fontWeight ?? "400"}
            onChange={(e) => setStyle({ fontWeight: e.target.value })}
          >
            {["100", "200", "300", "400", "500", "600", "700", "800", "900"].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumInput
          label="Letter-spacing"
          value={style.letterSpacing ?? ""}
          onChange={(v) => setStyle({ letterSpacing: v })}
          suffix=""
        />
        <NumInput
          label="Line-height"
          value={style.lineHeight ?? ""}
          onChange={(v) => setStyle({ lineHeight: v })}
          suffix=""
        />
      </div>

      <div className="space-y-1">
        <Label className="text-[10px]">Alineación</Label>
        <div className="grid grid-cols-3 gap-1">
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setStyle({ textAlign: a })}
              className={`h-7 rounded border text-[10px] ${
                (style.textAlign ?? "left") === a
                  ? "border-primary bg-primary/10 text-zinc-100"
                  : "border-border text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {a === "left" ? "Izq" : a === "center" ? "Centro" : "Der"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px]">Estilo</Label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Negrita"
            onClick={() => setStyle({ fontWeight: parseInt(style.fontWeight ?? "400", 10) >= 700 ? "400" : "700" })}
            className={`h-7 w-7 rounded border flex items-center justify-center ${
              parseInt(style.fontWeight ?? "400", 10) >= 700
                ? "border-primary bg-primary/10 text-zinc-100"
                : "border-border text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Itálica"
            onClick={() => setStyle({ fontStyle: style.fontStyle === "italic" ? "normal" : "italic" })}
            className={`h-7 w-7 rounded border flex items-center justify-center ${
              style.fontStyle === "italic"
                ? "border-primary bg-primary/10 text-zinc-100"
                : "border-border text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Subrayado"
            onClick={() =>
              setStyle({ textDecoration: style.textDecoration === "underline" ? "none" : "underline" })
            }
            className={`h-7 w-7 rounded border flex items-center justify-center ${
              style.textDecoration === "underline"
                ? "border-primary bg-primary/10 text-zinc-100"
                : "border-border text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            <Underline className="h-3.5 w-3.5" />
          </button>
          <span className="w-px h-5 bg-border mx-1" />
          {(["none", "uppercase", "lowercase", "capitalize"] as const).map((t) => (
            <button
              key={t}
              type="button"
              title={`text-transform: ${t}`}
              onClick={() => setStyle({ textTransform: t })}
              className={`h-7 px-1.5 rounded border text-[9px] ${
                (style.textTransform ?? "none") === t
                  ? "border-primary bg-primary/10 text-zinc-100"
                  : "border-border text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {t === "none" ? "Aa" : t === "uppercase" ? "AB" : t === "lowercase" ? "ab" : "Ab"}
            </button>
          ))}
        </div>
      </div>

      <ColorRow
        label="Color texto"
        value={style.color}
        onChange={(v) => setStyle({ color: v })}
        fallback="#ffffff"
      />

      <div className="rounded border border-border p-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase tracking-wider">Sombra texto</Label>
          {style.textShadow && (
            <button
              type="button"
              className="text-[9px] text-zinc-500 hover:text-zinc-300"
              onClick={() => setStyle({ textShadow: undefined })}
            >
              quitar
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {(
            [
              ["x", "X"],
              ["y", "Y"],
              ["blur", "Blur"],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-0.5">
              <Label className="text-[9px]">{label}</Label>
              <Input
                type="number"
                className="h-6 text-[11px]"
                value={shadow[k]}
                onChange={(e) =>
                  setStyle({
                    textShadow: composeTextShadow({ ...shadow, [k]: parseFloat(e.target.value) || 0 }),
                  })
                }
              />
            </div>
          ))}
        </div>
        <ColorRow
          label="Color sombra"
          value={shadow.color.startsWith("#") ? shadow.color : "#000000"}
          onChange={(v) => setStyle({ textShadow: composeTextShadow({ ...shadow, color: v }) })}
          fallback="#000000"
        />
      </div>
    </div>
  );
}

function parseFilter(value: string | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  if (!value) return out;
  const re = /([a-z-]+)\(([0-9.]+)([a-z%]*)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(value))) {
    out[m[1]!] = parseFloat(m[2]!);
  }
  return out;
}

function composeFilter(parts: Record<string, number>): string | undefined {
  const order = ["brightness", "contrast", "saturate", "blur", "grayscale"];
  const pieces: string[] = [];
  for (const k of order) {
    const v = parts[k];
    if (v == null) continue;
    if (k === "blur") pieces.push(`blur(${v}px)`);
    else pieces.push(`${k}(${v}%)`);
  }
  return pieces.length ? pieces.join(" ") : undefined;
}

export function InspectorImageTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  const fileRef = useRef<HTMLInputElement>(null);
  const filters = useMemo(() => parseFilter(style.filter), [style.filter]);

  const onUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setStyle({ imageUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const setFilter = (key: string, value: number | undefined) => {
    const next = { ...filters };
    if (value == null || (key !== "blur" && value === 100) || (key === "blur" && value === 0)) {
      delete next[key];
    } else {
      next[key] = value;
    }
    setStyle({ filter: composeFilter(next) });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-[10px]">URL imagen / logo</Label>
        <Input
          className="h-7 text-xs"
          value={style.imageUrl?.startsWith("data:") ? "(imagen local)" : style.imageUrl ?? ""}
          onChange={(e) => setStyle({ imageUrl: e.target.value })}
          placeholder="https://..."
          disabled={style.imageUrl?.startsWith("data:")}
        />
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px]"
            onClick={() => fileRef.current?.click()}
          >
            Subir local
          </Button>
          {style.imageUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-[10px]"
              onClick={() => setStyle({ imageUrl: undefined })}
            >
              quitar
            </Button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
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
            <option value="none">none</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px]">Object-position</Label>
          <select
            className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
            value={style.objectPosition ?? "center"}
            onChange={(e) => setStyle({ objectPosition: e.target.value })}
          >
            <option value="center">center</option>
            <option value="top">top</option>
            <option value="bottom">bottom</option>
            <option value="left">left</option>
            <option value="right">right</option>
            <option value="top left">top-left</option>
            <option value="top right">top-right</option>
            <option value="bottom left">bottom-left</option>
            <option value="bottom right">bottom-right</option>
          </select>
        </div>
      </div>

      <NumInput label="Border radius" value={style.borderRadius ?? ""} onChange={(v) => setStyle({ borderRadius: v })} />

      <div className="rounded border border-border p-2 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase tracking-wider">Filtros</Label>
          {style.filter && (
            <button
              type="button"
              className="text-[9px] text-zinc-500 hover:text-zinc-300"
              onClick={() => setStyle({ filter: undefined })}
            >
              reset
            </button>
          )}
        </div>
        {(
          [
            ["brightness", "Brillo %", 0, 200, 100],
            ["contrast", "Contraste %", 0, 200, 100],
            ["saturate", "Saturación %", 0, 200, 100],
            ["grayscale", "B&N %", 0, 100, 0],
            ["blur", "Blur px", 0, 20, 0],
          ] as const
        ).map(([key, label, min, max, def]) => {
          const v = filters[key] ?? def;
          return (
            <div key={key} className="space-y-0.5">
              <div className="flex items-center justify-between text-[9px] text-zinc-500">
                <span>{label}</span>
                <span className="tabular-nums">{v}</span>
              </div>
              <Input
                type="range"
                min={min}
                max={max}
                value={v}
                onChange={(e) => setFilter(key, parseFloat(e.target.value))}
                className="h-1 cursor-pointer"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function parseBoxShadow(value: string | undefined): { x: number; y: number; blur: number; spread: number; color: string } {
  if (!value) return { x: 0, y: 4, blur: 12, spread: 0, color: "#00000066" };
  const colorMatch = value.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})/);
  const color = colorMatch ? colorMatch[1] : "#00000066";
  const nums = value
    .replace(colorMatch?.[1] ?? "", "")
    .trim()
    .split(/\s+/)
    .map((n) => parseFloat(n) || 0);
  return { x: nums[0] ?? 0, y: nums[1] ?? 4, blur: nums[2] ?? 12, spread: nums[3] ?? 0, color };
}

function composeBoxShadow({
  x,
  y,
  blur,
  spread,
  color,
}: {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}): string {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

export function InspectorColorsTab({ style, setStyle }: Pick<FieldProps, "style" | "setStyle">) {
  const boxShadow = parseBoxShadow(style.boxShadow);

  return (
    <div className="space-y-3">
      <ColorRow
        label="Texto"
        value={style.color}
        onChange={(v) => setStyle({ color: v })}
        fallback="#ffffff"
      />
      <ColorRow
        label="Fondo"
        value={style.backgroundColor}
        onChange={(v) => setStyle({ backgroundColor: v })}
        fallback="#000000"
      />
      <ColorRow
        label="Borde"
        value={style.borderColor}
        onChange={(v) => setStyle({ borderColor: v })}
        fallback="#3b82f6"
      />
      <ColorRow
        label="Acento"
        value={style.accentColor}
        onChange={(v) => setStyle({ accentColor: v })}
        fallback="#1a5cff"
      />

      <div className="grid grid-cols-2 gap-2">
        <NumInput
          label="Borde ancho"
          value={style.borderWidth ?? ""}
          onChange={(v) => setStyle({ borderWidth: v })}
        />
        <div className="space-y-1">
          <Label className="text-[10px]">Borde estilo</Label>
          <select
            className="w-full h-8 rounded-md border border-border bg-muted/50 text-xs"
            value={style.borderStyle ?? "solid"}
            onChange={(e) => setStyle({ borderStyle: e.target.value })}
          >
            <option value="solid">solid</option>
            <option value="dashed">dashed</option>
            <option value="dotted">dotted</option>
            <option value="double">double</option>
          </select>
        </div>
      </div>

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

      <div className="rounded border border-border p-2 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase tracking-wider">Sombra caja</Label>
          {style.boxShadow && (
            <button
              type="button"
              className="text-[9px] text-zinc-500 hover:text-zinc-300"
              onClick={() => setStyle({ boxShadow: undefined })}
            >
              quitar
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(
            [
              ["x", "X"],
              ["y", "Y"],
              ["blur", "Blur"],
              ["spread", "Spread"],
            ] as const
          ).map(([k, label]) => (
            <div key={k} className="space-y-0.5">
              <Label className="text-[9px]">{label}</Label>
              <Input
                type="number"
                className="h-6 text-[11px]"
                value={boxShadow[k]}
                onChange={(e) =>
                  setStyle({
                    boxShadow: composeBoxShadow({
                      ...boxShadow,
                      [k]: parseFloat(e.target.value) || 0,
                    }),
                  })
                }
              />
            </div>
          ))}
        </div>
        <ColorRow
          label="Color sombra"
          value={boxShadow.color.startsWith("#") ? boxShadow.color : "#000000"}
          onChange={(v) => setStyle({ boxShadow: composeBoxShadow({ ...boxShadow, color: v }) })}
          fallback="#000000"
        />
      </div>
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

"use client";

import { type ReactNode, useCallback } from "react";
import { useEditorStore } from "@/lib/store/editor-store";
import type { ElementStyle } from "@/types";
import { cn } from "@/lib/utils";

interface MovableLayerProps {
  id: string;
  children: ReactNode;
  className?: string;
  editable?: boolean;
  groupParent?: string;
}

export function MovableLayer({
  id,
  children,
  className,
  editable = true,
  groupParent,
}: MovableLayerProps) {
  const positions = useEditorStore((s) => s.positions);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);
  const designMode = useEditorStore((s) => s.designMode);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const setPosition = useEditorStore((s) => s.setPosition);

  const pos = positions[id];
  const style = elements[id] ?? {};
  const visible = visibility[id] !== false;
  const isSelected = selectedId === id;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!editable) return;
      e.stopPropagation();
      setSelectedId(id);
      const startX = e.clientX;
      const startY = e.clientY;
      const baseLeft = parseFloat(pos?.left ?? style.left ?? "0") || 0;
      const baseTop = parseFloat(pos?.top ?? style.top ?? "0") || 0;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        setPosition(id, {
          left: `${baseLeft + dx}px`,
          top: `${baseTop + dy}px`,
        });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [editable, id, pos, style, setPosition, setSelectedId]
  );

  const merged: React.CSSProperties = {
    position: groupParent ? "relative" : "absolute",
    left: groupParent ? undefined : pos?.left ?? style.left,
    top: groupParent ? undefined : pos?.top ?? style.top,
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    color: style.color,
    opacity: style.opacity ? Number(style.opacity) : undefined,
    width: style.width,
    height: style.height,
    backgroundColor: style.backgroundColor,
    textShadow: style.textShadow,
    borderRadius: style.borderRadius,
    cursor: editable ? "grab" : "default",
  };

  if (!visible && !designMode) return null;

  return (
    <div
      data-editable={id}
      className={cn(
        "ss-movable",
        !visible && "ss-hidden-widget",
        isSelected && editable && "ss-selected",
        className
      )}
      style={merged}
      onPointerDown={onPointerDown}
      tabIndex={editable ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function mergeStyles(
  base: ElementStyle,
  override?: ElementStyle
): ElementStyle {
  return { ...base, ...override };
}

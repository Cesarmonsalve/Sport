"use client";

import { type ReactNode, useCallback } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { useEditorStore } from "@/lib/store/editor-store";
import type { WidgetAnimation } from "@/types";
import { cn } from "@/lib/utils";

interface MovableLayerProps {
  id: string;
  children: ReactNode;
  className?: string;
  editable?: boolean;
  groupParent?: string;
}

const animVariants: Record<
  WidgetAnimation,
  { initial: TargetAndTransition; animate: TargetAndTransition }
> = {
  none: { initial: {}, animate: {} },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  slide: { initial: { opacity: 0, x: -24 }, animate: { opacity: 1, x: 0 } },
};

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
  const animation = (style.animation ?? "none") as WidgetAnimation;
  const variant = animVariants[animation] ?? animVariants.none;

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
        setPosition(id, {
          left: `${baseLeft + ev.clientX - startX}px`,
          top: `${baseTop + ev.clientY - startY}px`,
        });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [editable, id, pos?.left, pos?.top, style.left, style.top, setPosition, setSelectedId]
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

  const shared = {
    "data-editable": id,
    className: cn(
      "ss-movable",
      !visible && "ss-hidden-widget",
      isSelected && editable && "ss-selected",
      className
    ),
    style: merged,
    onPointerDown,
    tabIndex: editable ? 0 : undefined,
  };

  if (animation === "none") {
    return <div {...shared}>{children}</div>;
  }

  return (
    <motion.div
      {...shared}
      initial={variant.initial}
      animate={variant.animate}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

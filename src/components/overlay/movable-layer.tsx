"use client";

import { memo, type ReactNode } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import { useLayerDrag } from "@/hooks/use-layer-drag";
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

export const MovableLayer = memo(function MovableLayer({
  id,
  children,
  className,
  editable = true,
  groupParent,
}: MovableLayerProps) {
  const sport = useEditorStore((s) => s.sport);
  const positions = useEditorStore((s) => s.positions);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);
  const designMode = useEditorStore((s) => s.designMode);
  const editorMode = useEditorStore((s) => s.editorMode);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const textOverrides = useEditorStore((s) => s.textOverrides);
  const zIndexMap = useEditorStore((s) => s.zIndex);

  const pos = positions[id];
  const style = elements[id] ?? {};
  const visible = visibility[id] !== false;
  const isSelected = selectedId === id || selectedIds.includes(id);
  const animation = (style.animation ?? "none") as WidgetAnimation;
  const variant = animVariants[animation] ?? animVariants.none;

  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const isChild = !!groupParent;
  const canDrag =
    editable && (editorMode === "advanced" ? true : !isChild);

  const { onPointerDown, guide } = useLayerDrag(
    id,
    canDrag,
    pos?.left,
    pos?.top,
    style.left,
    style.top
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
    zIndex: zIndexMap[id] ?? (style.zIndex ? Number(style.zIndex) : undefined),
    cursor: canDrag ? "grab" : "default",
  };

  if (!visible && !designMode) return null;

  const content =
    designMode && textOverrides[id] ? (
      <span className="text-sm text-white/90">{textOverrides[id]}</span>
    ) : (
      children
    );

  const shared = {
    "data-editable": id,
    "data-widget-id": id,
    className: cn(
      "ss-movable",
      !visible && "ss-hidden-widget",
      isSelected && canDrag && "ss-selected",
      registry[id]?.compound && "ss-compound",
      className
    ),
    style: merged,
    onPointerDown,
    tabIndex: canDrag ? 0 : undefined,
  };

  const guideEl =
    guide && isSelected ? (
      <>
        {guide.x != null && (
          <div
            className="pointer-events-none fixed inset-y-0 w-px bg-primary/50 z-[9998]"
            style={{ left: guide.x }}
          />
        )}
        {guide.y != null && (
          <div
            className="pointer-events-none fixed inset-x-0 h-px bg-primary/50 z-[9998]"
            style={{ top: guide.y }}
          />
        )}
      </>
    ) : null;

  if (animation === "none") {
    return (
      <>
        {guideEl}
        <div {...shared}>{content}</div>
      </>
    );
  }

  return (
    <>
      {guideEl}
      <motion.div
        {...shared}
        initial={variant.initial}
        animate={variant.animate}
        transition={{ duration: 0.35 }}
      >
        {content}
      </motion.div>
    </>
  );
});

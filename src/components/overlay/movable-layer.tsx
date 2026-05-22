"use client";

import { memo, type ReactNode, useCallback, useRef } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { LayerTransformHandles } from "@/components/editor/layer-transform-handles";
import { elementStyleToCss } from "@/lib/overlay/style-to-css";
import { useEditorStore } from "@/lib/store/editor-store";
import { useLayerDrag } from "@/hooks/use-layer-drag";
import type { WidgetAnimation } from "@/types";
import { cn } from "@/lib/utils";

interface MovableLayerProps {
  id: string;
  children: ReactNode;
  className?: string;
  editable?: boolean;
  groupParent?: string;
  interactive?: boolean;
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
  interactive = false,
}: MovableLayerProps) {
  const positions = useEditorStore((s) => s.positions);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);
  const designMode = useEditorStore((s) => s.designMode);
  const freeEditMode = useEditorStore((s) => s.freeEditMode);
  const moveAsBlock = useEditorStore((s) => s.moveAsBlock);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const textOverrides = useEditorStore((s) => s.textOverrides);
  const zIndexMap = useEditorStore((s) => s.zIndex);
  const lockedIds = useEditorStore((s) => s.lockedIds);
  const inlineEditId = useEditorStore((s) => s.inlineEditId);
  const setInlineEditId = useEditorStore((s) => s.setInlineEditId);
  const setTextOverride = useEditorStore((s) => s.setTextOverride);

  const pos = positions[id];
  const style = elements[id] ?? {};
  const visible = visibility[id] !== false;
  const isSelected =
    interactive && (selectedId === id || selectedIds.includes(id));
  const isChild = !!groupParent;
  const canDrag =
    editable &&
    interactive &&
    !lockedIds[id] &&
    (freeEditMode || !moveAsBlock || !isChild);
  const animation = (style.animation ?? "none") as WidgetAnimation;
  const variant = animVariants[animation] ?? animVariants.none;
  const w = parseFloat(style.width ?? "120") || 120;
  const h = parseFloat(style.height ?? "64") || 64;

  const { onPointerDown, guide } = useLayerDrag(
    id,
    canDrag,
    pos?.left,
    pos?.top,
    style.left,
    style.top
  );

  const editRef = useRef<HTMLSpanElement>(null);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;
      e.stopPropagation();
      setInlineEditId(id);
      requestAnimationFrame(() => editRef.current?.focus());
    },
    [interactive, id, setInlineEditId]
  );

  const childPos =
    groupParent && (pos || style.left || style.top)
      ? { left: pos?.left ?? style.left ?? "0", top: pos?.top ?? style.top ?? "0" }
      : undefined;
  const merged = elementStyleToCss(id, style, groupParent ? childPos : pos);
  if (zIndexMap[id] != null) merged.zIndex = zIndexMap[id];
  merged.cursor = canDrag ? "grab" : lockedIds[id] ? "not-allowed" : "default";
  if (groupParent) {
    const freeChild = freeEditMode || !!childPos;
    merged.position = freeChild ? "absolute" : "relative";
    if (!freeChild) {
      merged.left = undefined;
      merged.top = undefined;
    }
  } else if (pos) {
    merged.position = "absolute";
  }

  if (!visible && !designMode && !interactive) return null;

  const content =
    inlineEditId === id ? (
      <span
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-w-[24px] text-inherit"
        onBlur={(e) => {
          setTextOverride(id, e.currentTarget.textContent ?? "");
          setInlineEditId(null);
        }}
      >
        {textOverrides[id] ?? ""}
      </span>
    ) : textOverrides[id] && (designMode || interactive) ? (
      <span>{textOverrides[id]}</span>
    ) : (
      children
    );

  const shared = {
    "data-editable": id,
    "data-widget-id": id,
    className: cn(
      "ss-movable",
      !visible && "ss-hidden-widget",
      isSelected && "ss-selected ss-bounding-box",
      lockedIds[id] && "ss-locked",
      className
    ),
    style: merged,
    onPointerDown,
    onDoubleClick,
    tabIndex: canDrag ? 0 : undefined,
  };

  const guideEl =
    guide && isSelected ? (
      <>
        {guide.x != null && (
          <div className="pointer-events-none fixed inset-y-0 w-px bg-primary/50 z-[9998]" style={{ left: guide.x }} />
        )}
        {guide.y != null && (
          <div className="pointer-events-none fixed inset-x-0 h-px bg-primary/50 z-[9998]" style={{ top: guide.y }} />
        )}
      </>
    ) : null;

  const handles =
    isSelected && interactive && !lockedIds[id] ? (
      <LayerTransformHandles id={id} width={w} height={h} />
    ) : null;

  const inner = (
    <>
      {content}
      {handles}
    </>
  );

  if (animation === "none") {
    return (
      <>
        {guideEl}
        <div {...shared} className={cn(shared.className, "relative inline-block")}>
          {inner}
        </div>
      </>
    );
  }

  return (
    <>
      {guideEl}
      <motion.div
        {...shared}
        className={cn(shared.className, "relative inline-block")}
        initial={variant.initial}
        animate={variant.animate}
        transition={{ duration: 0.35 }}
      >
        {inner}
      </motion.div>
    </>
  );
});

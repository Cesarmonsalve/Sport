"use client";

import { memo, type ReactNode, useCallback, useRef } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { LayerTransformHandles } from "@/components/editor/layer-transform-handles";
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
  interactive = true,
}: MovableLayerProps) {
  const positions = useEditorStore((s) => s.positions);
  const elements = useEditorStore((s) => s.elements);
  const visibility = useEditorStore((s) => s.visibility);
  const designMode = useEditorStore((s) => s.designMode);
  const editorMode = useEditorStore((s) => s.editorMode);
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
    editable && interactive && !lockedIds[id] && (editorMode === "advanced" ? true : !isChild);
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
      if (!interactive || !designMode) return;
      e.stopPropagation();
      setInlineEditId(id);
      requestAnimationFrame(() => editRef.current?.focus());
    },
    [interactive, designMode, id, setInlineEditId]
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
    border: style.borderColor ? `2px solid ${style.borderColor}` : undefined,
    zIndex: zIndexMap[id] ?? (style.zIndex ? Number(style.zIndex) : undefined),
    transform: style.rotate ? `rotate(${style.rotate})` : undefined,
    cursor: canDrag ? "grab" : lockedIds[id] ? "not-allowed" : "default",
  };

  if (!visible && !designMode) return null;

  const content =
    inlineEditId === id ? (
      <span
        ref={editRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-w-[40px] text-sm"
        onBlur={(e) => {
          setTextOverride(id, e.currentTarget.textContent ?? "");
          setInlineEditId(null);
        }}
      >
        {textOverrides[id] ?? ""}
      </span>
    ) : designMode && textOverrides[id] ? (
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
          <div className="pointer-events-none fixed inset-y-0 w-px bg-primary/40 z-[9998]" style={{ left: guide.x }} />
        )}
        {guide.y != null && (
          <div className="pointer-events-none fixed inset-x-0 h-px bg-primary/40 z-[9998]" style={{ top: guide.y }} />
        )}
      </>
    ) : null;

  const handles =
    isSelected && interactive && editorMode === "advanced" ? (
      <LayerTransformHandles id={id} width={w} height={h} />
    ) : null;

  if (animation === "none") {
    return (
      <>
        {guideEl}
        <div {...shared} className={cn(shared.className, "relative")}>
          {content}
          {handles}
        </div>
      </>
    );
  }

  return (
    <>
      {guideEl}
      <motion.div
        {...shared}
        className={cn(shared.className, "relative")}
        initial={variant.initial}
        animate={variant.animate}
        transition={{ duration: 0.35 }}
      >
        {content}
        {handles}
      </motion.div>
    </>
  );
});

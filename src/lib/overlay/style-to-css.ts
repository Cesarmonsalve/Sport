import type { ElementStyle } from "@/types";

/** Aplica estilos del store a CSS inline + variables --ss-* */
export function elementStyleToCss(
  id: string,
  style: ElementStyle,
  pos?: { left: string; top: string }
): React.CSSProperties {
  const vars: Record<string, string> = {};
  if (style.color) vars["--ss-color"] = style.color;
  if (style.accentColor) vars["--ss-accent"] = style.accentColor;
  if (style.fontSize) vars["--ss-font-size"] = style.fontSize;
  if (style.fontFamily) vars["--ss-font-family"] = style.fontFamily;

  return {
    ...vars,
    position: undefined,
    left: pos?.left ?? style.left,
    top: pos?.top ?? style.top,
    width: style.width,
    height: style.height,
    minWidth: style.minWidth ?? (style.width ? undefined : "1px"),
    minHeight: style.minHeight ?? (style.height ? undefined : "1px"),
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight as React.CSSProperties["fontWeight"],
    letterSpacing: style.letterSpacing,
    lineHeight: style.lineHeight,
    textAlign: style.textAlign as React.CSSProperties["textAlign"],
    color: style.color,
    opacity: style.opacity != null ? Number(style.opacity) : undefined,
    backgroundColor: style.backgroundColor,
    textShadow: style.textShadow,
    boxShadow: style.boxShadow,
    borderRadius: style.borderRadius,
    border: style.borderWidth
      ? `${style.borderWidth} solid ${style.borderColor ?? "transparent"}`
      : style.borderColor
        ? `1px solid ${style.borderColor}`
        : undefined,
    padding: style.padding,
    margin: style.margin,
    gap: style.gap,
    zIndex: style.zIndex ? Number(style.zIndex) : undefined,
    transform: style.rotate ? `rotate(${style.rotate})` : undefined,
    objectFit: style.objectFit as React.CSSProperties["objectFit"],
  };
}

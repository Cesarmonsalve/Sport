import type { ElementStyle } from "@/types";

export const SNAP_GRID = 8;
export const SNAP_THRESHOLD = 6;

export interface ElementRect {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

export interface AlignmentGuides {
  vertical: number[];
  horizontal: number[];
}

export function parsePx(v: string | undefined, fallback: number) {
  const n = parseFloat(v ?? "");
  return Number.isFinite(n) ? n : fallback;
}

export function buildElementRects(
  positions: Record<string, { left: string; top: string }>,
  elements: Record<string, ElementStyle>,
  excludeId?: string
): ElementRect[] {
  const out: ElementRect[] = [];
  for (const [id, pos] of Object.entries(positions)) {
    if (id === excludeId) continue;
    const st = elements[id] ?? {};
    const left = parsePx(pos.left, 0);
    const top = parsePx(pos.top, 0);
    const width = parsePx(st.width, 120);
    const height = parsePx(st.height, 64);
    out.push({
      id,
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    });
  }
  return out;
}

export function snapPosition(args: {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  peers: ElementRect[];
  snapGrid: boolean;
  snapElements: boolean;
  canvasW?: number;
  canvasH?: number;
}): { left: number; top: number; guides: AlignmentGuides } {
  const { left: l0, top: t0, width, height, peers, snapGrid, snapElements } = args;
  const right = l0 + width;
  const bottom = t0 + height;
  const centerX = l0 + width / 2;
  const centerY = t0 + height / 2;

  let left = l0;
  let top = t0;
  const vertical: number[] = [];
  const horizontal: number[] = [];

  if (snapGrid) {
    left = Math.round(left / SNAP_GRID) * SNAP_GRID;
    top = Math.round(top / SNAP_GRID) * SNAP_GRID;
  }

  if (snapElements && peers.length) {
    const vTargets: number[] = [];
    const hTargets: number[] = [];
    for (const p of peers) {
      vTargets.push(p.left, p.centerX, p.right);
      hTargets.push(p.top, p.centerY, p.bottom);
    }
    const cw = args.canvasW ?? 1920;
    const ch = args.canvasH ?? 1080;
    vTargets.push(0, cw / 2, cw);
    hTargets.push(0, ch / 2, ch);

    const xPoints = [
      { val: left, set: (v: number) => { left = v; } },
      { val: centerX, set: (v: number) => { left = v - width / 2; } },
      { val: right, set: (v: number) => { left = v - width; } },
    ];
    const yPoints = [
      { val: top, set: (v: number) => { top = v; } },
      { val: centerY, set: (v: number) => { top = v - height / 2; } },
      { val: bottom, set: (v: number) => { top = v - height; } },
    ];

    let bestDx = SNAP_THRESHOLD + 1;
    let bestDy = SNAP_THRESHOLD + 1;
    let hitX: number | undefined;
    let hitY: number | undefined;

    for (const xp of xPoints) {
      for (const t of vTargets) {
        const d = Math.abs(xp.val - t);
        if (d <= SNAP_THRESHOLD && d < bestDx) {
          bestDx = d;
          hitX = t;
          const newLeft =
            t === xp.val ? t : t === centerX ? t - width / 2 : t - width;
          left = newLeft;
        }
      }
    }
    for (const yp of yPoints) {
      for (const t of hTargets) {
        const d = Math.abs(yp.val - t);
        if (d <= SNAP_THRESHOLD && d < bestDy) {
          bestDy = d;
          hitY = t;
          const newTop =
            t === yp.val ? t : t === centerY ? t - height / 2 : t - height;
          top = newTop;
        }
      }
    }
    if (hitX != null) vertical.push(hitX);
    if (hitY != null) horizontal.push(hitY);
  }

  if (snapGrid) {
    left = Math.round(left / SNAP_GRID) * SNAP_GRID;
    top = Math.round(top / SNAP_GRID) * SNAP_GRID;
  }

  return {
    left,
    top,
    guides: {
      vertical: [...new Set(vertical)],
      horizontal: [...new Set(horizontal)],
    },
  };
}

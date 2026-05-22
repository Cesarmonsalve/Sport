import type {
  ElementDataBinding,
  ElementStyle,
  FreeCanvasElement,
} from "@/types";

export type EditorHistorySnap = {
  positions: Record<string, { left: string; top: string }>;
  elements: Record<string, ElementStyle>;
  visibility: Record<string, boolean>;
  freeElements: FreeCanvasElement[];
  textOverrides: Record<string, string>;
  zIndex: Record<string, number>;
  dataBindings: Record<string, ElementDataBinding>;
};

export const MAX_HISTORY = 20;

export function captureHistorySnap(state: {
  positions: EditorHistorySnap["positions"];
  elements: EditorHistorySnap["elements"];
  visibility: EditorHistorySnap["visibility"];
  freeElements: FreeCanvasElement[];
  textOverrides: EditorHistorySnap["textOverrides"];
  zIndex: EditorHistorySnap["zIndex"];
  dataBindings: EditorHistorySnap["dataBindings"];
}): EditorHistorySnap {
  return {
    positions: { ...state.positions },
    elements: { ...state.elements },
    visibility: { ...state.visibility },
    freeElements: [...state.freeElements],
    textOverrides: { ...state.textOverrides },
    zIndex: { ...state.zIndex },
    dataBindings: { ...state.dataBindings },
  };
}

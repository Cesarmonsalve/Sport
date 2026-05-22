"use client";

import { createContext, useContext } from "react";

export const CanvasScaleContext = createContext(1);

export function useCanvasScale() {
  return useContext(CanvasScaleContext);
}

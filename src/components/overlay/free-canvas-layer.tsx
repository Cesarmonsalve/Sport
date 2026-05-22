"use client";

import { memo } from "react";
import Image from "next/image";
import { MovableLayer } from "@/components/overlay/movable-layer";
import { useEditorStore } from "@/lib/store/editor-store";

export const FreeCanvasLayer = memo(function FreeCanvasLayer({
  interactive = false,
}: {
  interactive?: boolean;
}) {
  const freeElements = useEditorStore((s) => s.freeElements);
  const visibility = useEditorStore((s) => s.visibility);

  return (
    <>
      {freeElements.map((el) => {
        if (visibility[el.id] === false) return null;
        return (
          <MovableLayer
            key={el.id}
            id={el.id}
            className="ss-free-element inline-block"
            editable
            interactive={interactive}
          >
            <div className="relative flex flex-col items-center gap-0.5">
              {el.type === "dropped-player-photo" || el.type === "free-image" ? (
                el.imageUrl ? (
                  <Image
                    src={el.imageUrl}
                    alt={el.label ?? ""}
                    width={80}
                    height={80}
                    unoptimized
                    className="rounded-md object-cover"
                    style={{
                      width: el.width ?? "80px",
                      height: el.height ?? "80px",
                    }}
                  />
                ) : (
                  <div
                    className="bg-white/10 rounded-md"
                    style={{ width: el.width ?? "80px", height: el.height ?? "80px" }}
                  />
                )
              ) : el.type === "free-text" ? (
                <span
                  style={{
                    fontSize: el.fontSize ?? "24px",
                    fontFamily: '"Bebas Neue", sans-serif',
                    color: "#fff",
                  }}
                >
                  {el.text ?? "Texto"}
                </span>
              ) : (
                <div
                  className="border-2 border-dashed border-white/30 rounded"
                  style={{
                    width: el.width ?? "120px",
                    height: el.height ?? "80px",
                    backgroundColor: el.backgroundColor ?? "rgba(0,0,0,0.5)",
                  }}
                />
              )}
              {el.label && (
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[9px] text-white/90 border border-white/10">
                  {el.label}
                </span>
              )}
            </div>
          </MovableLayer>
        );
      })}
    </>
  );
});

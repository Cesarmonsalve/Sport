"use client";

import { Button } from "@/components/ui/button";

interface ResetCanvasDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetCanvasDialog({ open, onConfirm, onCancel }: ResetCanvasDialogProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[10002] bg-black/60" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-labelledby="reset-canvas-title"
        className="fixed left-1/2 top-1/2 z-[10003] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-5 shadow-xl"
      >
        <h3 id="reset-canvas-title" className="text-sm font-semibold">
          ¿Reiniciar canvas?
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Se restaurarán las posiciones de todos los widgets según la plantilla activa (o valores
          de fábrica). También se eliminarán fotos sueltas y elementos libres del canvas. No se
          borra el room ni el partido ESPN seleccionado.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Reiniciar layout
          </Button>
        </div>
      </div>
    </>
  );
}

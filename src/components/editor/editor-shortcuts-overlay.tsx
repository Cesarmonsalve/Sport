"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ShortcutGroup {
  title: string;
  items: { keys: string; label: string }[];
}

const GROUPS: ShortcutGroup[] = [
  {
    title: "Edición",
    items: [
      { keys: "Ctrl+Z", label: "Deshacer" },
      { keys: "Ctrl+Y", label: "Rehacer" },
      { keys: "Ctrl+D", label: "Duplicar selección" },
      { keys: "Ctrl+G", label: "Agrupar" },
      { keys: "Ctrl+Shift+G", label: "Desagrupar" },
      { keys: "Delete", label: "Ocultar / borrar (free)" },
      { keys: "Shift+Delete", label: "Mostrar todo" },
      { keys: "Ctrl+Shift+C", label: "Copiar estilo" },
      { keys: "Ctrl+Shift+V", label: "Pegar estilo" },
    ],
  },
  {
    title: "Selección / capas",
    items: [
      { keys: "Click", label: "Seleccionar" },
      { keys: "Shift+Click", label: "Sumar/quitar de selección" },
      { keys: "Shift+Drag", label: "Box select" },
      { keys: "Ctrl+A", label: "Seleccionar todo" },
      { keys: "Esc", label: "Limpiar selección" },
      { keys: "Ctrl+]", label: "Subir z-index" },
      { keys: "Ctrl+[", label: "Bajar z-index" },
      { keys: "L", label: "Lock / unlock" },
      { keys: "H", label: "Ocultar / mostrar" },
    ],
  },
  {
    title: "Canvas / vista",
    items: [
      { keys: "Space + drag", label: "Pan del canvas" },
      { keys: "Ctrl + scroll", label: "Zoom con cursor" },
      { keys: "Ctrl + +", label: "Zoom in" },
      { keys: "Ctrl + -", label: "Zoom out" },
      { keys: "Ctrl + 0", label: "Zoom 100%" },
      { keys: "F", label: "Fit al viewport" },
      { keys: "P", label: "Toggle sidebar" },
      { keys: "Shift + G", label: "Toggle snap a grid" },
    ],
  },
  {
    title: "Posición",
    items: [
      { keys: "↑ ↓ ← →", label: "Mover 1 px" },
      { keys: "Shift + flecha", label: "Mover 8 px" },
    ],
  },
  {
    title: "Escenas",
    items: [
      { keys: "1 - 9", label: "Aplicar escena 1–9" },
      { keys: "Space", label: "Vista OBS (preview)" },
    ],
  },
  {
    title: "Ayuda",
    items: [
      { keys: "?", label: "Esta hoja de atajos" },
      { keys: "Shift + ?", label: "Esta hoja de atajos" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function EditorShortcutsOverlay({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Atajos del editor"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-3xl overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Atajos del editor</h2>
            <p className="text-[11px] text-zinc-500">Esc para cerrar · ? para abrir esta ventana</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <section key={g.title} className="space-y-1.5">
              <h3 className="text-[10px] uppercase tracking-wider text-zinc-500">{g.title}</h3>
              <ul className="space-y-1">
                {g.items.map((i) => (
                  <li key={i.keys + i.label} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-zinc-300">{i.label}</span>
                    <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">
                      {i.keys}
                    </kbd>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

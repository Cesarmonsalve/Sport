"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadAppSettings, saveAppSettings } from "@/lib/settings/app-settings";

const STEPS = [
  {
    title: "Elige deporte y partido",
    body: "Abre el dashboard o el dock Producción, selecciona un partido ESPN en vivo (🔴) o usa modo Mock para diseñar sin datos.",
  },
  {
    title: "Copia URLs a OBS",
    body: "En Producción → OBS copia cada Browser Source con el mismo ?room=. Activa Vista OBS en el menú del header para previsualizar sin guías.",
  },
  {
    title: "Sincroniza y transmite",
    body: "El editor publica por MQTT al room. Los overlays en OBS reciben posiciones y marcador automáticamente. Exporta proyecto JSON para respaldar.",
  },
];

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const s = loadAppSettings();
    if (!s.onboardingDone) setOpen(true);
  }, []);

  const finish = () => {
    saveAppSettings({ onboardingDone: true });
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const cur = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) finish();
      }}
    >
      <div
        className="relative max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          onClick={finish}
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-[10px] uppercase tracking-widest text-primary">
          Paso {step + 1} / {STEPS.length}
        </p>
        <h2 id="onboarding-title" className="mt-2 text-lg font-semibold">
          {cur.title}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{cur.body}</p>
        <div className="mt-6 flex justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Atrás
          </Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setStep((s) => s + 1)}>
              Siguiente
            </Button>
          ) : (
            <Button size="sm" onClick={finish}>
              Empezar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

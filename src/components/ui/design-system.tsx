import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Slate/zinc tokens — Linear/Vercel-style app shell */
export const ds = {
  bg: "bg-zinc-950",
  surface: "bg-zinc-900/80",
  border: "border-zinc-800",
  textMuted: "text-zinc-500",
  accent: "text-blue-500",
  radius: "rounded-lg",
  shadow: "shadow-xl shadow-black/40",
} as const;

export function AppNav({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "mx-auto flex max-w-5xl items-center justify-between px-6 py-5",
        className
      )}
    >
      <Link
        href="/"
        className="text-sm font-medium tracking-tight text-zinc-100 hover:text-white transition-colors"
      >
        Stream Sports
      </Link>
      {children}
    </nav>
  );
}

export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-zinc-950 text-zinc-100", className)}>
      {children}
    </div>
  );
}

export function PageMain({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <main
      className={cn(
        "mx-auto px-6 pb-20",
        narrow ? "max-w-lg" : "max-w-5xl",
        className
      )}
    >
      {children}
    </main>
  );
}

export function SurfaceCard({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/60 p-6",
        hover && "transition-colors hover:border-zinc-700 hover:bg-zinc-900/80",
        className
      )}
    >
      {children}
    </div>
  );
}

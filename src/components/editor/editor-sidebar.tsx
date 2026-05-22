"use client";

import { motion } from "framer-motion";
import {
  Layers,
  LayoutGrid,
  Settings,
  Radio,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CollapsiblePlayerGallery } from "@/components/editor/player-gallery-panel";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overlays", icon: Layers, label: "Overlays" },
  { id: "widgets", icon: LayoutGrid, label: "Widgets" },
  { id: "data", icon: Radio, label: "Datos" },
  { id: "config", icon: Settings, label: "Config" },
] as const;

interface EditorSidebarProps {
  sport: Sport;
}

export function EditorSidebar({ sport }: EditorSidebarProps) {
  const collapsed = useEditorStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useEditorStore((s) => s.toggleSidebar);
  const registry = sport === "nba" ? NBA_REGISTRY : MLB_REGISTRY;
  const visibility = useEditorStore((s) => s.visibility);
  const setVisibility = useEditorStore((s) => s.setVisibility);
  const selectedId = useEditorStore((s) => s.selectedId);
  const setSelectedId = useEditorStore((s) => s.setSelectedId);
  const editorMode = useEditorStore((s) => s.editorMode);
  const widgetSearch = useEditorStore((s) => s.widgetSearch);
  const setWidgetSearch = useEditorStore((s) => s.setWidgetSearch);
  const addFreeElement = useEditorStore((s) => s.addFreeElement);

  const roots = Object.values(registry).filter(
    (e) =>
      !e.parent &&
      (editorMode === "advanced" || e.compound) &&
      (!widgetSearch.trim() ||
        e.label.toLowerCase().includes(widgetSearch.toLowerCase()) ||
        e.id.toLowerCase().includes(widgetSearch.toLowerCase()))
  );

  const byCat = roots.reduce<Record<string, typeof roots>>((acc, e) => {
    const cat = e.category.split(" · ")[0];
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(e);
    return acc;
  }, {});

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 220 }}
      className="flex h-full shrink-0 flex-col border-r border-border bg-card"
    >
      <div className="flex h-12 items-center justify-between border-b border-border px-2">
        {!collapsed && (
          <span className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Capas
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <nav className="flex gap-1 border-b border-border p-2">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className="flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground"
              title={label}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      )}

      {!collapsed && <CollapsiblePlayerGallery sport={sport} />}

      {!collapsed && (
        <div className="border-b border-border p-2 space-y-1">
          <Input
            className="h-7 text-xs"
            placeholder="Buscar widget…"
            value={widgetSearch}
            onChange={(e) => setWidgetSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              className="text-[9px] rounded px-1.5 py-0.5 bg-muted hover:bg-accent"
              onClick={() => addFreeElement("free-text")}
            >
              + Texto
            </button>
            <button
              type="button"
              className="text-[9px] rounded px-1.5 py-0.5 bg-muted hover:bg-accent"
              onClick={() => addFreeElement("free-image")}
            >
              + Imagen
            </button>
            <button
              type="button"
              className="text-[9px] rounded px-1.5 py-0.5 bg-muted hover:bg-accent"
              onClick={() => addFreeElement("free-rect")}
            >
              + Rect
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {!collapsed &&
          Object.entries(byCat).map(([cat, items]) => (
            <div key={cat} className="mb-4">
              <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                        selectedId === item.id
                          ? "bg-primary/15 text-foreground"
                          : "hover:bg-accent"
                      )}
                    >
                      <Eye className="h-3 w-3 shrink-0 opacity-50" />
                      <span className="truncate flex-1">{item.label}</span>
                      <Switch
                        checked={visibility[item.id] !== false}
                        onCheckedChange={(v) => setVisibility(item.id, v)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </motion.aside>
  );
}

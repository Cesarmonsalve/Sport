"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  LayoutGrid,
  Database,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CollapsiblePlayerGallery } from "@/components/editor/player-gallery-panel";
import { EspnRosterPanel } from "@/components/editor/espn-roster-panel";
import { CanvasBackgroundPanel } from "@/components/editor/canvas-background-panel";
import { LayerPanel } from "@/components/editor/layer-panel";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor-store";
import { NBA_REGISTRY } from "@/lib/registry/nba";
import { MLB_REGISTRY } from "@/lib/registry/mlb";
import type { Sport } from "@/types";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "layers", icon: Layers, label: "Capas" },
  { id: "widgets", icon: LayoutGrid, label: "Widgets" },
  { id: "data", icon: Database, label: "Datos" },
  { id: "env", icon: ImageIcon, label: "Fondo" },
] as const;

interface EditorSidebarProps {
  sport: Sport;
}

export function EditorSidebar({ sport }: EditorSidebarProps) {
  const [activeNav, setActiveNav] = useState<(typeof NAV)[number]["id"]>("layers");
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
      animate={{ width: collapsed ? 52 : 240 }}
      className="flex h-full shrink-0 flex-col border-r border-zinc-800 bg-zinc-950"
    >
      <div className="flex h-11 items-center justify-between border-b border-zinc-800 px-2">
        {!collapsed && (
          <span className="px-2 text-xs font-medium text-zinc-400">Panel</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto h-8 w-8 text-zinc-500 hover:text-zinc-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className={cn("flex flex-col gap-0.5 p-2", collapsed && "items-center")}>
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveNav(id)}
            title={label}
            className={cn(
              "flex items-center gap-2 rounded-md transition-colors",
              collapsed ? "h-9 w-9 justify-center" : "w-full px-2.5 py-2",
              activeNav === id
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-xs">{label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && activeNav !== "env" && activeNav !== "data" && (
        <div className="border-t border-zinc-800 px-2 py-2">
          <CollapsiblePlayerGallery sport={sport} />
        </div>
      )}

      {!collapsed && activeNav === "widgets" && (
        <div className="border-b border-zinc-800 px-2 pb-2 space-y-2">
          <Input
            className="h-8 text-xs bg-zinc-900 border-zinc-800"
            placeholder="Buscar widget…"
            value={widgetSearch}
            onChange={(e) => setWidgetSearch(e.target.value)}
          />
          <div className="flex gap-1">
            {(
              [
                ["free-text", "Texto"],
                ["free-image", "Img"],
                ["free-rect", "Rect"],
              ] as const
            ).map(([type, label]) => (
              <button
                key={type}
                type="button"
                className="flex flex-1 items-center justify-center gap-0.5 rounded-md border border-zinc-800 py-1 text-[10px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                onClick={() => addFreeElement(type)}
              >
                <Plus className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {!collapsed && activeNav === "data" && <EspnRosterPanel sport={sport} />}
        {!collapsed && activeNav === "env" && <CanvasBackgroundPanel />}
        {!collapsed && activeNav === "layers" && <LayerPanel sport={sport} />}
        {!collapsed &&
          activeNav === "widgets" &&
          Object.entries(byCat).map(([cat, items]) => (
            <div key={cat} className="mb-4">
              <p className="mb-1.5 px-1 text-[10px] font-medium text-zinc-600">{cat}</p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors",
                        selectedId === item.id
                          ? "bg-blue-500/10 text-zinc-100 ring-1 ring-blue-500/30"
                          : "text-zinc-400 hover:bg-zinc-900"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5 shrink-0 opacity-40" />
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

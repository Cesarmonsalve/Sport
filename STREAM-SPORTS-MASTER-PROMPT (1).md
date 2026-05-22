# 🎯 STREAM SPORTS — MASTER PROMPT
## Mega Upgrade: De overlay tool a plataforma broadcast completa (NBA + MLB)

> **Contexto del proyecto:** Stream Sports es una plataforma Next.js 15 / TypeScript / Tailwind 4 / Zustand / Framer Motion / MQTT para overlays deportivos en OBS. Ya tiene editor libre con canvas, widgets NBA/MLB, proxy ESPN, sync MQTT, templates y escenas. El objetivo es implementar **todas las mejoras descritas aquí en una sola pasada**, sin dividir por secciones ni sprints. El alcance de esta versión es **exclusivamente NBA y MLB**.

---

## 🧠 ANÁLISIS DE COMPETIDORES (referencia para superar)

| Producto | Precio | Fortalezas | Debilidad que explotamos |
|---|---|---|---|
| **OBScoreboard** | ~$25/mo | Setup 60s, phone control, 12+ sports, HD templates | Pago, scores manuales, sin auto-fetch ESPN |
| **StreamSlayers** | Pago | 15+ ligas, 6 estilos scorebug, ticker con odds/standings/noticias/sponsors, glass/industrial/retro themes | Pago, sin editor visual libre |
| **OmniScores** | Freemium | 6 deportes, simple, URL única | Sin editor, UI básica, sin datos auto |
| **Tracker.gg** | Free | Esports stats widgets | No cubre deportes tradicionales |
| **OverlayOn** | Freemium | Editor visual drag/drop, templates | Sin datos deportivos en vivo |
| **StreamElements** | Free | Cloud editor, drag/drop general | No deportes específicos, sin ESPN |

**Nuestra ventaja diferencial:** Gratis + self-hosted + ESPN automático + editor libre canvas + MQTT sync + per-widget OBS URLs.
**Gap a cerrar:** 6 estilos visuales de scorebug, ticker avanzado, mobile remote, layer panel, undo/redo robusto, brand kit.

---

## 📋 INSTRUCCIONES DE IMPLEMENTACIÓN

> **IMPORTANTE:** Implementar **todo lo siguiente de una sola vez**. No separar por fases, no hacer una feature y preguntar. Leer este documento completo antes de escribir una sola línea de código, luego ejecutar todos los cambios en paralelo. El resultado final debe ser una versión completamente funcional con todas las features incluidas.

---

## 1. 🎨 SISTEMA DE ESTILOS DE SCOREBUG (6 temas)

Cada widget de marcador (`NbaScoreBug`, `MlbScoreboard`) debe soportar 6 variantes visuales.

```typescript
// src/types/index.ts
export type ScorebugStyle = "broadcast" | "glass" | "industrial" | "retro" | "minimal" | "esports";
```

**Diseño de cada estilo:**

- **`broadcast`** — Negro sólido, fuente `Barlow Condensed` bold, gradientes sutiles, divisor central con logo liga
- **`glass`** — `backdrop-filter: blur(24px) saturate(160%)`, fondo `rgba(10,10,20,0.55)`, bordes glassmorphism, texto blanco
- **`industrial`** — Fondo `#1a1a1a`, borde 2px `#f0c040`, fuente `Roboto Mono`, esquinas rectas, `box-shadow: 4px 4px 0 #f0c040`
- **`retro`** — Fondo `#0a0a0a`, fuente `VT323`, borde 3px `#00ff41`, scanlines CSS via `::after`, animación flip board
- **`minimal`** — Fondo transparent, solo texto con `text-shadow: 0 2px 8px rgba(0,0,0,0.9)`, sin bordes
- **`esports`** — Gradiente `rgba(15,15,35,0.95)→rgba(35,15,50,0.95)`, `clip-path` con esquinas cortadas, border-image RGB

```css
/* globals.css o CSS module del widget */
.scorebug-glass {
  background: rgba(10, 10, 20, 0.55);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
}
.scorebug-industrial {
  background: #1a1a1a;
  border: 2px solid #f0c040;
  font-family: 'Roboto Mono', monospace;
  box-shadow: 4px 4px 0 #f0c040;
}
.scorebug-retro {
  background: #0a0a0a;
  font-family: 'VT323', monospace;
  border: 3px solid #00ff41;
  image-rendering: pixelated;
}
.scorebug-minimal {
  background: transparent;
  text-shadow: 0 2px 8px rgba(0,0,0,0.9);
}
.scorebug-esports {
  background: linear-gradient(135deg, rgba(15,15,35,0.95), rgba(35,15,50,0.95));
  border-top: 2px solid;
  border-image: linear-gradient(90deg, #ff006e, #8338ec, #3a86ff) 1;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}
```

**Fuentes a agregar en `layout.tsx`:**
```
Barlow Condensed (700,800) · Barlow (400,500,600) · Roboto Mono (400,700)
VT323 · Rajdhani (600,700) · Exo 2 (400,700) · Outfit (300,400,600)
```

**Implementación en componentes:**
```tsx
// NbaScoreBug.tsx y MlbScoreboard.tsx — agregar prop:
interface ScorebugProps {
  style?: ScorebugStyle; // default: "broadcast"
}

// Usar cn() + lookup de clase CSS por estilo
// Guardar en editorStore.scorebugStyle
// Inspector → pestaña "Vis" → selector de estilo con preview miniatura de cada variante
```

---

## 2. 📰 BROADCAST TICKER AVANZADO

Componente nuevo `BroadcastTicker` — rotación automática de slides con duración configurable.

```typescript
// src/types/index.ts
export interface TickerSlide {
  type: "game_score" | "standings" | "news" | "stat_leader" | "sponsor" | "custom";
  duration: number; // segundos
  enabled: boolean;
  data?: Record<string, unknown>;
}
```

**Tipos de contenido:**
- `game_score` — Partidos en vivo / recientes del día (ESPN scoreboard auto)
- `standings` — Tabla de posiciones NBA/MLB (ESPN standings endpoint)
- `stat_leader` — Líder de estadísticas: puntos/ERA/etc (ESPN leaders endpoint)
- `news` — Headlines de `https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/news`
- `sponsor` — Logo + tagline del sponsor (usa `brandKit.sponsorSlots`)
- `custom` — Texto libre configurable en Inspector

**Controles en Inspector:**
- Toggle por tipo de slide (on/off)
- Duración por slide (slider 3–15s)
- Editar sponsors manualmente
- Preview del ticker en tiempo real

**Rutas OBS dedicadas:**
```
/overlay/nba/ticker?room=ROOM
/overlay/mlb/ticker?room=ROOM
```

---

## 3. 📱 CONTROL REMOTO MOBILE

Ruta dedicada `/remote?room=ROOM` — panel mobile-first sin cargar el editor completo.

```
┌─────────────────────┐
│  🔴 EN VIVO  ROOM   │
│  LAL  108 | 103 BOS │
│  Q3  4:32            │
├─────────────────────┤
│  [+1 HOME] [+1 AWAY]│
│  [+2 HOME] [+2 AWAY]│
│  [+3 HOME] [+3 AWAY]│
├─────────────────────┤
│  ESCENAS            │
│  [Solo marcador]    │
│  [Broadcast full]   │
│  [Streamer campo]   │
├─────────────────────┤
│  WIDGETS RÁPIDOS    │
│  [👁 Scorebug]      │
│  [👁 Lineup]        │
│  [👁 Ticker]        │
└─────────────────────┘
```

- Publica vía MQTT al mismo room del editor: usar `useStreamSync(false, room)` (solo publish)
- Usar `useMqttSubscribe` para recibir el estado actual
- Touch-friendly: botones mínimo 64px de alto
- Sin autenticación en esta versión (room como token)
- PWA-ready: agregar `manifest.json` + service worker básico

---

## 4. 🎬 ANIMACIONES Y TRANSICIONES

**Transiciones de escena** — al cambiar de escena en el Dock Producción:
```typescript
export type SceneTransition = "cut" | "fade" | "slide-left" | "slide-up" | "wipe" | "dissolve";
```
Implementar con Framer Motion `AnimatePresence` en el overlay canvas. Duración configurable (0.2s–1.5s). Guardar en `editorStore.sceneTransition`.

**Animaciones de entrada por widget:**
```typescript
// Expandir tipo existente:
type WidgetAnimation = "none" | "fade" | "slide" | "scale" | "flip" | "bounce";
```
Cada widget nuevo que se hace visible ejecuta su `entering` animation. Configurable en Inspector → Vis → Animación entrada.

**Score Flip Animation** (mejorar el actual):
- Perspectiva 3D real con `perspective` + `rotateX`
- Opciones: `pulse-glow`, número grande que se achica, o confetti (ya existe)

**Widget nuevo: Lower Third animado**
```typescript
// src/components/overlay/nba/LowerThird.tsx
// src/components/overlay/mlb/LowerThird.tsx
// Props: title, subtitle, teamColor, style: "standard" | "breaking" | "sponsored"
// Animación: slide desde izquierda con barra de color del equipo
```

---

## 5. 🗂️ LAYER PANEL

Nueva pestaña "Capas" en `EditorSidebar` — estilo Figma/After Effects.

```
┌─────────────────────────────┐
│  CAPAS                 [+]  │
├─────────────────────────────┤
│  👁 🔒  nba-scorebug        │  ← drag z-index
│  👁 🔒    ├ sb-home-score   │
│  👁 🔒    ├ sb-away-score   │
│  👁 🔒    └ sb-clock        │
│  👁 🔒  team-logo-home      │
│  👁 🔒  sponsor-ticker      │
│  👁 🔒  ▼ quinteto-widget   │
└─────────────────────────────┘
```

- Drag entre capas para reordenar z-index → `setZIndex()` en store
- Click en ojo → toggle visibilidad (ya existe, conectar UI)
- Click en candado → `lockElement(id)` — no puede moverse en canvas
- Click en nombre → seleccionar elemento (`setSelectedId`)
- Indent para elementos hijo (compound widgets)

```typescript
// Store updates:
lockedElements: string[];
lockElement: (id: string) => void;
unlockElement: (id: string) => void;
```

---

## 6. ↩️ UNDO / REDO ROBUSTO

El sistema de historia ya existe (`src/lib/store/history.ts`). Expandirlo:

```typescript
// Agregar al store:
canUndo: () => boolean;
canRedo: () => boolean;
historyIndex: number;
historyStack: EditorHistorySnap[];
undo: () => void;
redo: () => void;
```

- Atajos: `Ctrl+Z` (undo), `Ctrl+Shift+Z` / `Ctrl+Y` (redo) → agregar a `use-editor-shortcuts.ts`
- Botones ↩ ↪ en header con estado `disabled` cuando no hay historia
- Guardar snapshot en cada acción: mover, resize, cambiar color, toggle visibilidad, cambiar texto

---

## 7. 📐 HERRAMIENTAS DE ALINEACIÓN

Panel flotante cuando hay múltiples elementos seleccionados (extender `SelectionFloatingToolbar`):

```
┌──────────────────────────────────────────┐
│  ↕⬆  ↕⬇  ↕⬅  ↕➡  ↔center  ↕middle     │
│  [═══] distribuir H  [⣿] distribuir V  │
│  W: [___]  H: [___]  mismo tamaño       │
└──────────────────────────────────────────┘
```

Funciones sobre `selectedIds`:
- Alinear por borde: izquierda, derecha, arriba, abajo
- Centrar: horizontal, vertical
- Distribuir: espaciado uniforme horizontal/vertical
- Mismo tamaño: width, height, ambos

---

## 8. 🎨 BRAND KIT

Nueva sección en Settings (`/settings`) → pestaña "Marca":

```typescript
// src/types/index.ts
export interface BrandKit {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontDisplay: string;     // Google Font para títulos
  fontBody: string;        // Google Font para cuerpo
  logoUrl?: string;        // logo del canal del streamer
  watermarkUrl?: string;
  sponsorSlots: SponsorSlot[];
}

export interface SponsorSlot {
  id: string;
  name: string;
  logoUrl: string;
  tagline?: string;
  duration: number;        // segundos en ticker
  link?: string;
}
```

**Aplicación automática al guardar:**
- Widgets con `accentColor` heredan `primaryColor`
- El ticker de sponsors usa `sponsorSlots` automáticamente
- El `font-family` del canvas se actualiza
- Se guarda en `localStorage` y se sincroniza vía MQTT

---

## 9. 📊 DASHBOARD MEJORADO

Expandir `/dashboard/nba` y `/dashboard/mlb` con 4 tabs:

1. **Hoy** — Partidos en vivo + próximos (ya existe, mejorar card)
2. **Standings** — Tabla de posiciones ESPN en tiempo real
3. **Líderes** — Top 5 stats (puntos/ERA/rebotes según deporte)
4. **Historial** — Últimos 7 días de partidos

**Card de partido mejorada:**
```tsx
// Mostrar: logos, score, estado (EN VIVO parpadeante / PRÓXIMO / FINAL)
// Botón "Abrir en editor" → /editor/nba?event=ID&room=ROOM
// Win probability bar si ESPN lo expone
// Quick-stats: líder del partido
```

---

## 10. 🔧 MEJORAS DE EDITOR

### Inspector — tabs reorganizados

```
┌─────────────────────────────────────────┐
│  [Posición] [Estilo] [Datos] [Anim] [+] │
├─────────────────────────────────────────┤
│  POSICIÓN                               │
│  X: [___] Y: [___]  🔒 lock position   │
│  W: [___] H: [___]  ⬡ mantener ratio   │
│  Rotar: [___]°  Opacidad: [___]%       │
├─────────────────────────────────────────┤
│  ESTILO                                 │
│  Color fondo: [   ] Borde: [   ]        │
│  Radio: [___]px  Sombra: [toggle]       │
│  Fuente: [dropdown]  Tamaño: [___]      │
├─────────────────────────────────────────┤
│  DATOS (solo si tiene data binding)     │
│  Fuente: [ESPN ▼] / [Manual]            │
│  Campo ESPN: [dropdown campos]          │
│  Texto manual: [_______________]        │
├─────────────────────────────────────────┤
│  ANIMACIÓN                              │
│  Entrada: [dropdown] Duración: [___]ms  │
│  Trigger: [on-show / on-score / manual] │
│  Preview: [▶ Previsualizar]             │
└─────────────────────────────────────────┘
```

### Canvas — mejoras UX

1. **Reglas CSS** — píxeles en bordes top y left del canvas
2. **Guides** — arrastrar desde reglas para crear guías cyan
3. **Snap mejorado** — snap a otros elementos, líneas de alineación al arrastrar
4. **Zoom** — `Ctrl+scroll`, botones `-/+` en toolbar, "fit to screen"
5. **Modos de preview:** `1920×1080`, `1280×720`, `Safe zone`

### Atajos de teclado (agregar a `use-editor-shortcuts.ts`)

| Atajo | Acción |
|---|---|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+A` | Select all visible |
| `Ctrl+D` | Duplicate selected |
| `Ctrl+G` | Group selection |
| `Delete` / `Backspace` | Eliminar elemento |
| `Arrow keys` | Mover 1px |
| `Shift+Arrow` | Mover 10px |
| `Ctrl+[` / `Ctrl+]` | Subir/bajar z-index |
| `H` | Toggle hide selected |
| `L` | Toggle lock selected |
| `F` | Fit canvas to window |
| `1-9` | Activar escenas 1-9 del dock |
| `Space` | Preview mode (ocultar UI editor) |

---

## 🏗️ ARQUITECTURA TÉCNICA

### ESPN API — endpoints a usar

```typescript
// src/lib/espn/client.ts — agregar helpers:

// Standings
export async function fetchStandings(sport: string, league: string) {
  return espnFetch(`/${sport}/${league}/standings`);
}

// Stat leaders
export async function fetchLeaders(sport: string, league: string) {
  return espnFetch(`/${sport}/${league}/leaders`);
}

// News
export async function fetchNews(sport: string, league: string, limit = 5) {
  return espnFetch(`/${sport}/${league}/news?limit=${limit}`);
}

// Team schedule
export async function fetchTeamSchedule(sport: string, league: string, teamId: string) {
  return espnFetch(`/${sport}/${league}/teams/${teamId}/schedule`);
}
```

Rutas ESPN base para NBA y MLB:
- NBA: `basketball/nba/scoreboard`, `basketball/nba/standings`, `basketball/nba/leaders`
- MLB: `baseball/mlb/scoreboard`, `baseball/mlb/standings`, `baseball/mlb/leaders`

### Rutas API nuevas (Next.js)

```
GET /api/espn/basketball/nba/standings
GET /api/espn/basketball/nba/leaders
GET /api/espn/basketball/nba/news
GET /api/espn/baseball/mlb/standings
GET /api/espn/baseball/mlb/leaders
GET /api/espn/baseball/mlb/news
GET /api/espn/[sport]/[league]/teams/[id]/schedule
```

Seguir el patrón existente en `src/app/api/espn/[...path]/route.ts` — ya maneja rutas dinámcias, solo verificar que estos paths funcionen.

### Store — nuevos campos

```typescript
interface EditorStore {
  // Estilos de scorebug
  scorebugStyle: ScorebugStyle;
  setScorebugStyle: (s: ScorebugStyle) => void;

  // Undo/Redo
  historyIndex: number;
  historyStack: EditorHistorySnap[];
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Layer panel
  lockedElements: string[];
  lockElement: (id: string) => void;
  unlockElement: (id: string) => void;

  // Brand Kit
  brandKit: BrandKit;
  setBrandKit: (kit: Partial<BrandKit>) => void;

  // Ticker
  tickerSlides: TickerSlide[];
  setTickerSlides: (slides: TickerSlide[]) => void;

  // Scene transitions
  sceneTransition: SceneTransition;
  setSceneTransition: (t: SceneTransition) => void;
}
```

### Tipos nuevos completos (`src/types/index.ts`)

```typescript
export type ScorebugStyle = "broadcast" | "glass" | "industrial" | "retro" | "minimal" | "esports";
export type SceneTransition = "cut" | "fade" | "slide-left" | "slide-up" | "wipe" | "dissolve";
export type WidgetAnimation = "none" | "fade" | "slide" | "scale" | "flip" | "bounce";

export interface BrandKit {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontDisplay: string;
  fontBody: string;
  logoUrl?: string;
  watermarkUrl?: string;
  sponsorSlots: SponsorSlot[];
}

export interface SponsorSlot {
  id: string;
  name: string;
  logoUrl: string;
  tagline?: string;
  duration: number;
  link?: string;
}

export interface TickerSlide {
  type: "game_score" | "standings" | "news" | "stat_leader" | "sponsor" | "custom";
  duration: number;
  enabled: boolean;
  data?: Record<string, unknown>;
}
```

### Dependencias a agregar

```json
{
  "dependencies": {
    "react-colorful": "^5.6.1",
    "react-hot-toast": "^2.4.1",
    "canvas-confetti": "^1.9.3",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-select": "^2.1.2",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1"
  }
}
```

### Estructura de archivos nueva (todo de una vez)

```
src/
├── types/index.ts                         ← agregar todos los tipos nuevos
├── lib/
│   ├── espn/client.ts                     ← agregar fetchStandings, fetchLeaders, fetchNews
│   └── store/
│       ├── editor-store.ts                ← agregar campos nuevos del store
│       └── history.ts                     ← expandir undo/redo
├── components/
│   ├── overlay/
│   │   ├── nba/
│   │   │   ├── NbaScoreBug.tsx            ← agregar prop style: ScorebugStyle
│   │   │   ├── LowerThird.tsx             ← widget nuevo
│   │   │   └── BroadcastTicker.tsx        ← componente nuevo
│   │   └── mlb/
│   │       ├── MlbScoreboard.tsx          ← agregar prop style: ScorebugStyle
│   │       ├── LowerThird.tsx             ← widget nuevo
│   │       └── BroadcastTicker.tsx        ← componente nuevo
│   └── editor/
│       ├── EditorSidebar.tsx              ← agregar pestaña Capas (LayerPanel)
│       ├── LayerPanel.tsx                 ← componente nuevo
│       ├── Inspector.tsx                  ← tabs reorganizados
│       ├── SelectionFloatingToolbar.tsx   ← agregar herramientas de alineación
│       └── BrandKitPanel.tsx              ← componente nuevo
├── app/
│   ├── overlay/
│   │   ├── nba/
│   │   │   └── ticker/page.tsx            ← ruta OBS dedicada para ticker NBA
│   │   └── mlb/
│   │       └── ticker/page.tsx            ← ruta OBS dedicada para ticker MLB
│   ├── dashboard/
│   │   ├── nba/page.tsx                   ← expandir con tabs Standings/Líderes/Historial
│   │   └── mlb/page.tsx                   ← expandir con tabs Standings/Líderes/Historial
│   ├── remote/page.tsx                    ← control remoto mobile (ruta nueva)
│   ├── settings/page.tsx                  ← agregar pestaña Brand Kit
│   └── api/espn/[...path]/route.ts        ← verificar compatibilidad con nuevos paths
└── hooks/
    ├── use-editor-shortcuts.ts            ← agregar todos los atajos nuevos
    ├── use-nba-live.ts                    ← ya existe, verificar
    └── use-mlb-live.ts                   ← ya existe, verificar
```

---

## 🎯 INSTRUCCIONES PARA EL MODELO DE IA AL IMPLEMENTAR

1. **Lee primero** todos los archivos relevantes antes de escribir código — el store ya tiene mucha lógica, no duplicar.

2. **Implementa todo en una sola pasada** — no dividir en pasos ni preguntar entre features. El objetivo es entregar la versión completa con todas las mejoras juntas.

3. **Sigue los patrones existentes:**
   - Nuevos widgets → copiar estructura de `nba-scorebug.tsx` o `mlb-scoreboard.tsx`
   - Nuevos hooks → copiar patrón de `use-nba-live.ts`
   - Nuevos snapshots de juego → seguir `NbaGameSnapshot` en `src/types/index.ts`

4. **ESPN endpoints:**
   ```typescript
   // Siempre usar espnFetch() de src/lib/espn/client.ts
   // Nunca llamar ESPN directo desde el cliente — siempre vía /api/espn/
   ```

5. **Tailwind 4:** Usa CSS variables de `globals.css`. Para colores personalizados de widgets de overlay usa inline styles o CSS modules.

6. **MQTT Sync:** Todo cambio de estado pasa por el store de Zustand. El hook `use-stream-sync` ya publica los cambios. No crear canales MQTT custom.

7. **Mobile Remote:** La ruta `/remote` NO carga el editor completo. Solo usa `useStreamSync(false, room)` y `useMqttSubscribe`.

8. **TypeScript strict:** Todos los tipos nuevos van en `src/types/index.ts`. No usar `any`.

9. **Testing visual:** Overlays deben verse a 1920×1080 con fondo transparente. Usar `?design=1` en editor y `?room=test` en rutas overlay.

10. **Alcance de esta versión: solo NBA y MLB.** No agregar otros deportes. No agregar rutas ni tipos para NFL, NHL, MLS, EPL ni ningún otro. Todo el código debe ser exclusivamente para `basketball/nba` y `baseball/mlb`.

---

## 🚀 LANDING PAGE — ACTUALIZACIÓN

Agregar sección de comparación competitiva a `/` (page.tsx):

```
Stream Sports vs Competencia

Feature              | Stream Sports | OBScoreboard | StreamSlayers
ESPN Auto-fetch      |      ✅       |      ❌      |      ❌
Editor visual        |      ✅       |      ❌      |      ❌
Self-hosted          |      ✅       |      ❌      |      ❌
Gratis               |      ✅       |      ❌      |      ❌
6 estilos scorebug   |      ✅       |      ❌      |      ✅
Mobile remote        |      ✅       |      ✅      |      ❌
MQTT real-time       |      ✅       |      ❌      |      ❌
Per-widget URLs      |      ✅       |      ❌      |      ❌
Brand Kit            |      ✅       |      ❌      |      ❌
Layer Panel          |      ✅       |      ❌      |      ❌
```

---

*Generado el 22/05/2026 — Alcance: NBA + MLB únicamente. Implementación: todo en una sola pasada.*

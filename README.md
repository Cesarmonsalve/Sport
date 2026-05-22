# Stream Sports App

Plataforma broadcast de overlays deportivos (NBA / MLB) para OBS, construida con Next.js App Router.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación y desarrollo

```bash
cd stream-sports-app
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
npm start
```

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Landing premium |
| `/editor/nba` | Editor privado NBA (panel + sync) |
| `/editor/mlb` | Editor privado MLB |
| `/overlay/nba?room=ROOM` | Overlay OBS NBA — sin UI, fondo transparente |
| `/overlay/mlb?room=ROOM` | Overlay OBS MLB |
| `/overlay/nba?room=ROOM&widget=score-local` | Pop-out: solo un widget |
| `/overlay/nba?room=ROOM&design=1` | Modo diseño (mock, sin ESPN) |

### Parámetros query

- `room` — ID de sala sync (MQTT + localStorage). Mismo valor en editor y overlays.
- `widget` — Aísla un widget (`nba-scorebug`, `score-local`, `scoreboard`, etc.).
- `design=1` — Activa modo diseño con datos de ejemplo.

## URLs legacy (vanilla)

Los HTML originales **no se eliminaron** y siguen funcionando para OBS ya configurado:

| Archivo | Descripción |
|---------|-------------|
| `/index.html` | Landing + generador URLs |
| `/marcador_nba.html?room=…` | Panel + overlays NBA legacy |
| `/marcador_mlb_v4.html?room=…` | Panel + overlays MLB legacy |

El estado sync (`streamsports/{room}/state`) es compatible entre vanilla y esta app si usas el mismo `room`.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + componentes estilo shadcn/ui
- Framer Motion (microinteracciones editor)
- Zustand (estado editor + persistencia parcial)
- TanStack React Query (ESPN APIs)
- MQTT (`mqtt` npm) — misma lógica que `sync.js`

## Widgets portados vs pendientes

### NBA — portado (MVP)

| Widget | Editor | Overlay OBS | ESPN live |
|--------|--------|-------------|-----------|
| Scorebug (`nba-scorebug`) | ✅ | ✅ | ✅ scoreboard |
| Puntos local / visitante | ✅ | ✅ | ✅ |
| Reloj / cuarto | ✅ | ✅ | Parcial |
| Shot clock | ✅ | ✅ | Pendiente API |
| Logos equipo | ✅ | ✅ | ✅ |
| Tarjeta jugador | Registro | ⏳ | ⏳ |
| Quinteto | Registro | ⏳ | ⏳ |
| Destacado / placas | ⏳ | ⏳ | ⏳ |

### MLB — portado (MVP)

| Widget | Editor | Overlay OBS | ESPN live |
|--------|--------|-------------|-----------|
| Scoreboard | ✅ | ✅ | ✅ scoreboard |
| Line score | Registro | ⏳ | ⏳ |
| Roster lineup | Registro | ⏳ | ⏳ |
| Bases / matchup | ⏳ | ⏳ | ⏳ |
| Tarjetas pitcher/bateador | ⏳ | ⏳ | ⏳ |

## Layout editor

- **Sidebar** (~220px, colapsable): árbol de capas + visibilidad
- **Canvas**: preview 1920×1080 escalado, max-width centrado
- **Inspector** (300px): contextual al seleccionar — Diseño / Datos / Visibilidad
- **Dock**: selector partido ESPN

## OBS — configuración rápida

1. Abre `/editor/nba` (o MLB) y copia el **Room ID** / URL overlay.
2. En OBS: Fuente → Navegador → `http://localhost:3000/overlay/nba?room=TUROOM`
3. Resolución **1920×1080**, fondo transparente activado.
4. Para capas separadas, añade `&widget=score-local` (etc.).

## Estructura

```
src/
  app/           # Rutas App Router
  components/
    editor/      # Shell 3 columnas
    overlay/     # Widgets stream
    ui/          # shadcn-style
  lib/
    espn/        # Adapters NBA/MLB
    sync/        # Room + MQTT client
    store/       # Zustand
    registry/    # Átomos overlay
  types/
  hooks/
```

## Próximos pasos (roadmap)

- Portar tarjeta jugador, quinteto, roster MLB
- Inspector: animaciones, export JSON tema
- `elements` dirty-only en sync (ya en store, expandir UI)
- MQTT autenticado por room (P2)

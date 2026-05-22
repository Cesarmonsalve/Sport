# Stream Sports App

Plataforma broadcast de overlays deportivos (NBA / MLB) para OBS, construida con Next.js App Router.

## Requisitos

- Node.js 20+
- pnpm 10+ (o npm)

## Instalación

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
pnpm run build
pnpm start
```

### Deploy Vercel

1. Importa el repo `Cesarmonsalve/Sport`
2. Framework: Next.js
3. Build: `pnpm run build`
4. Variables: ninguna obligatoria (ESPN vía proxy interno)

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Landing premium |
| `/editor/nba` · `/editor/mlb` | Panel de producción |
| `/overlay/nba?room=ROOM` | Overlay completo NBA |
| `/overlay/nba/nba-scorebug?room=ROOM` | Widget dedicado (recomendado OBS) |
| `/overlay/mlb/scoreboard?room=ROOM` | Marcador MLB solo |
| `?design=1` | Modo diseño (mock, todos los widgets visibles) |
| `?widget=id` | Aísla widget (legacy, compatible con rutas dedicadas) |

## API ESPN (proxy)

```
GET /api/espn/basketball/nba/scoreboard?dates=20250522
GET /api/espn/basketball/nba/summary?event=401234567
GET /api/espn/baseball/mlb/scoreboard?dates=20250522
```

Evita CORS en el cliente; el front usa `src/lib/espn/client.ts`.

## Widgets

### NBA

| ID | Descripción |
|----|-------------|
| `nba-scorebug` | Marcador + reloj + shot clock + faltas (flip al anotar) |
| `card-jugador` | Tarjeta jugador destacado |
| `quinteto-widget` | 5 en cancha con headshots |
| `destacado-widget` | Strip MVP / destacado |

### MLB

| ID | Descripción |
|----|-------------|
| `scoreboard` | Marcador superior |
| `line-score` | Carreras por inning |
| `bases-widget` | Bases + B/S/O |
| `matchup-widget` | Pitcher vs bateador |
| `roster-widget` | Roster 12 slots |
| `play-ticker` | Últimas jugadas |

## Editor

- **Modo simple**: arrastra el scorebug/marcador como grupo
- **Modo avanzado**: hijos individuales
- **Shift + arrastrar**: box selection multi-widget
- **P**: colapsar sidebar · **Del**: ocultar widget · **Flechas**: nudge · **Shift+G**: snap 8px
- **Exportar / importar tema JSON**: barra inferior del editor

## Sync

MQTT + `localStorage`, room compartido entre editor y overlays (`?room=ABC123`).

## Stack

Next.js 15 · TypeScript · Tailwind 4 · Zustand · React Query · Framer Motion · MQTT

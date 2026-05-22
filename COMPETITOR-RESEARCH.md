# Competitor research — Stream Sports

Research date: May 2026. Sources: public marketing pages, OBS forums, GitHub READMEs.

## Competitors reviewed

| Product | Model | What streamers love | Gaps vs Stream Sports |
|---------|--------|---------------------|------------------------|
| **OBScoreboard** | SaaS ~$25/mo, browser URL | 60s OBS setup, phone control, team colors/logos, formations CSV, sponsor slots | Paid; manual scores; no ESPN auto for US pro leagues |
| **KeepTheScore** | Freemium overlay URL | Free tier, many sports presets, transparent OBS source | Manual control; watermark on free |
| **Live Sports Tracker** (laraiyeo) | Free web + GitHub | ESPN auto MLB/NBA/NFL/NHL, play-by-play, OBS URLs, 2s refresh | UI dated; not a full layout editor |
| **Overstream Studio** | Desktop €4/mo | Animated widgets, local-only privacy | Windows app; not browser-first |
| **Tracker.gg overlays** | Free (esports) | Game-specific stats overlays | Not traditional broadcast scorebug |
| **Fly Scoreboard** | OBS plugin | Hotkeys, docks, no browser hack | Local only; manual |
| **TrackScore** | Freemium | Timers, WebSocket sync, sport templates | Manual scoring focus |

**StreamSlayers / OmniScores / Trackerd:** No clear dedicated US broadcast scoreboard product found at these exact names; closest analogs are Live Sports Tracker (ESPN) and OBScoreboard (manual pro graphics).

## Patterns worth adopting (implemented or planned)

| Pattern | Our implementation |
|---------|-------------------|
| One-click scene presets | `broadcast-scenes.ts` — Marcador solo, Broadcast full, Campo streamer |
| Live games highlighted | Dashboard + dock badges `EN VIVO` |
| OBS URL generator | Panel Producción → copiar todas las URLs |
| Connection status | ESPN last fetch + MQTT badge |
| Hotkeys visible | Panel atajos en dock |
| Full project export | JSON proyecto (no solo tema) |
| Settings page | Room, poll interval, re-onboarding |
| Landing comparison | Feature matrix vs manual overlays |
| Possession indicator | NBA badge from ESPN `situation.possession` |
| Sponsor slot | Widget `sponsor-ticker` rotación |
| Consolidated header | Menú Producción vs 6 switches |
| Onboarding 3 steps | Modal primera visita |

## Implemented this session

- Dock **Producción**: ESPN/MQTT status, partido con 🔴 live, escenas 1-click, OBS URL generator, proyecto import/export, atajos
- **Dashboard** `/dashboard/[sport]` — partidos en vivo + recientes
- **Settings** `/settings` — room, poll interval, re-onboarding
- **Onboarding** 3 pasos (localStorage)
- **Landing** — matriz vs manual overlays
- **Header** consolidado — menú Producción, edición libre visible
- **Sponsor ticker** widget rotación
- **NBA possession** badge en scorebug (ESPN situation)
- Poll interval configurable desde settings

## Skipped (low ROI this session)

- Embedded live video streams (legal/complexity)
- Win probability (ESPN rarely exposes consistently)
- Mobile-native remote app (MQTT + editor web suffices)
- Paid tiers / billing
- Team color auto-extract from logo (future: canvas color pick from logo dominant)

## Stream Sports differentiators

- **ESPN proxy** for NBA/MLB scores, rosters, logos — automatic
- **Free self-hosted** Next.js — no subscription
- **Full layout editor** — free position, player cards, gallery drop
- **Per-widget OBS routes** — `/overlay/nba/nba-scorebug?room=`
- **MQTT sync** — multi-source same room

# Flujo editor canvas — Smart Slots (5 pasos)

## URLs

| Uso | URL |
|-----|-----|
| Editor NBA | `http://localhost:3000/editor/nba` |
| Editor MLB | `http://localhost:3000/editor/mlb` |
| Overlay OBS (sin fondo) | `http://localhost:3000/overlay/nba?room=TU_SALA` |
| Overlay con fondo | `http://localhost:3000/overlay/nba?room=TU_SALA&bg=1` |
| Remote | `http://localhost:3000/remote` |

## 5 pasos

1. **Partido** — Dock inferior o pestaña **Datos → ESPN Data**: elige partido ESPN (o modo diseño).
2. **Plantilla base** — En ESPN Data, pulsa **NBA cancha completa** o **MLB campo completo** (`applyBaseTemplate`). Carga fondo + Smart Slots (cancha solo nombre, lineup con foto).
3. **Arrastrar jugadores** — Desde ESPN Data o galería colapsable: suelta en slot con borde punteado *«Arrastra jugador aquí»*.
4. **Ajustar** — Mueve slots (8 handles + rotar), Inspector → Estilo → **Formas** (glass, neon-accent, etc.). Snap en header.
5. **Guardar / OBS** — **Guardar posiciones** (header o dock). Copia URL overlay sin `bg` para OBS. **Reiniciar canvas** vuelve a plantilla de stream (no borra smart slots hasta reset explícito).

## Smart Slot types

| Tipo | Foto | Uso |
|------|------|-----|
| `field-name-only` | No | Marcadores cancha/campo |
| `lineup-card` | Sí | Tarjetas lateral |
| `lower-third` | Configurable | Lower thirds |
| `free` | Sí | Slots libres |

ESPN en vivo actualiza slots por índice preservando posición/estilo; asignaciones **manual** no se sobrescriben.

## Atajos

- `Ctrl+G` agrupar · `Ctrl+Shift+G` desagrupar
- `Shift+clic` multi-selección
- Toolbar flotante: distribuir H/V

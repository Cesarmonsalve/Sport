import type {
  ElementDataBinding,
  GalleryPlayer,
  MlbGameSnapshot,
  NbaGameSnapshot,
  PlayerSlotBinding,
  SmartSlotDefinition,
} from "@/types";

function allowPhoto(slot: SmartSlotDefinition) {
  return slot.slotType === "lineup-card" || slot.slotType === "free";
}

export function bindingFromPlayer(
  slot: SmartSlotDefinition,
  player: GalleryPlayer
): { binding: PlayerSlotBinding; data: ElementDataBinding } {
  const binding: PlayerSlotBinding = {
    slotId: slot.id,
    athleteId: player.id,
    team: player.team,
    slotIndex: slot.slotIndex ?? 0,
    position: player.position,
    dataSource: "manual",
    manualName: player.name,
    manualImageUrl: allowPhoto(slot) ? player.headshot : undefined,
  };
  return {
    binding,
    data: {
      dataSource: "manual",
      manualText: player.name,
      manualImageUrl: allowPhoto(slot) ? player.headshot : undefined,
      athleteId: player.id,
      displayLabel: `${player.name} · ${player.teamAbbr}`,
    },
  };
}

export function mergeSmartSlotsFromNbaGame(
  game: NbaGameSnapshot,
  smartSlots: Record<string, SmartSlotDefinition>,
  bindings: Record<string, PlayerSlotBinding>
): Record<string, PlayerSlotBinding> {
  const next = { ...bindings };
  const home = game.onCourtHome ?? [];
  const away = game.onCourtAway ?? [];

  for (const slot of Object.values(smartSlots)) {
    if (slot.slotType !== "field-name-only" && slot.slotType !== "lineup-card") continue;
    const prev = next[slot.id];
    if (prev?.dataSource === "manual") continue;

    const list = slot.team === "home" ? home : slot.team === "away" ? away : [];
    const player = list[slot.slotIndex ?? 0];
    if (!player) continue;
    if (prev?.athleteId === player.id) continue;

    next[slot.id] = {
      slotId: slot.id,
      athleteId: player.id,
      team: slot.team ?? "home",
      slotIndex: slot.slotIndex ?? 0,
      position: player.position,
      dataSource: "espn",
    };
  }
  return next;
}

export function mergeSmartSlotsFromMlbGame(
  game: MlbGameSnapshot,
  smartSlots: Record<string, SmartSlotDefinition>,
  bindings: Record<string, PlayerSlotBinding>
): Record<string, PlayerSlotBinding> {
  const next = { ...bindings };
  const roster = [...(game.rosterHome ?? []), ...(game.rosterAway ?? [])];

  for (const slot of Object.values(smartSlots)) {
    if (slot.slotType !== "lineup-card") continue;
    const prev = next[slot.id];
    if (prev?.dataSource === "manual") continue;
    const idx = slot.slotIndex ?? 0;
    const list = slot.team === "home" ? game.rosterHome ?? [] : game.rosterAway ?? [];
    const player = list[idx] ?? roster[idx];
    if (!player) continue;
    if (prev?.athleteId === player.id) continue;
    next[slot.id] = {
      slotId: slot.id,
      athleteId: player.id,
      team: slot.team ?? "home",
      slotIndex: idx,
      position: player.position,
      dataSource: "espn",
    };
  }
  return next;
}

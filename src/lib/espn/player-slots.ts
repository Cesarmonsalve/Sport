import type { NbaGameSnapshot, NbaPlayer, PlayerSlotBinding } from "@/types";

const NBA_HOME_SLOTS = [
  "court-home-pg",
  "court-home-sg",
  "court-home-sf",
  "court-home-pf",
  "court-home-c",
] as const;
const NBA_AWAY_SLOTS = [
  "court-away-pg",
  "court-away-sg",
  "court-away-sf",
  "court-away-pf",
  "court-away-c",
] as const;

const POS_ORDER = ["PG", "SG", "SF", "PF", "C"];

function sortByPosition(players: NbaPlayer[]): NbaPlayer[] {
  return [...players].sort((a, b) => {
    const ia = POS_ORDER.indexOf(a.position ?? "");
    const ib = POS_ORDER.indexOf(b.position ?? "");
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

/** Merge ESPN players into fixed slots — preserves layout positions */
export function mergeNbaPlayersToSlots(
  game: NbaGameSnapshot,
  bindings: Record<string, PlayerSlotBinding>
): { game: NbaGameSnapshot; bindings: Record<string, PlayerSlotBinding>; changed: boolean } {
  const home = sortByPosition(game.onCourtHome ?? []);
  const away = sortByPosition(game.onCourtAway ?? []);
  let changed = false;
  const nextBindings = { ...bindings };

  const assign = (slotId: string, player: NbaPlayer | undefined, team: "home" | "away", idx: number) => {
    if (!player) return;
    const prev = nextBindings[slotId];
    if (prev?.athleteId !== player.id) changed = true;
    nextBindings[slotId] = {
      slotId,
      athleteId: player.id,
      team,
      slotIndex: idx,
      position: player.position,
    };
  };

  NBA_HOME_SLOTS.forEach((id, i) => assign(id, home[i], "home", i));
  NBA_AWAY_SLOTS.forEach((id, i) => assign(id, away[i], "away", i));

  return {
    game: {
      ...game,
      onCourtHome: home,
      onCourtAway: away,
    },
    bindings: nextBindings,
    changed,
  };
}

export function getPlayerForSlot(
  game: NbaGameSnapshot,
  slotId: string,
  bindings: Record<string, PlayerSlotBinding>
): NbaPlayer | undefined {
  const b = bindings[slotId];
  if (!b?.athleteId) {
    const homeIdx = NBA_HOME_SLOTS.indexOf(slotId as (typeof NBA_HOME_SLOTS)[number]);
    const awayIdx = NBA_AWAY_SLOTS.indexOf(slotId as (typeof NBA_AWAY_SLOTS)[number]);
    if (homeIdx >= 0) return game.onCourtHome?.[homeIdx];
    if (awayIdx >= 0) return game.onCourtAway?.[awayIdx];
    return undefined;
  }
  const list =
    b.team === "home" ? game.onCourtHome ?? [] : game.onCourtAway ?? [];
  return (
    list.find((p) => p.id === b.athleteId) ??
    list[b.slotIndex]
  );
}

export const NBA_COURT_SLOT_IDS = [...NBA_HOME_SLOTS, ...NBA_AWAY_SLOTS];

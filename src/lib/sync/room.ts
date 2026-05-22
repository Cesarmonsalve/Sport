const ROOM_KEY = "stream_sports_room";

export function randomRoomId(): string {
  const part = () => Math.random().toString(36).slice(2, 6);
  return `${part()}${part()}`.toUpperCase();
}

export function getPersistedRoom(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(ROOM_KEY) || "";
  } catch {
    return "";
  }
}

export function persistRoom(room: string): void {
  try {
    localStorage.setItem(ROOM_KEY, room);
  } catch {
    /* ignore */
  }
}

export function resolveRoom(explicit?: string, searchParams?: URLSearchParams): string {
  const fromUrl = searchParams?.get("room")?.trim() ?? "";
  let room = (explicit || fromUrl || getPersistedRoom() || "").trim();
  if (!room) {
    room = randomRoomId();
    persistRoom(room);
  } else {
    persistRoom(room);
  }
  return room;
}

export function appendRoomToPath(path: string, room: string): string {
  const u = new URL(path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  u.searchParams.set("room", room);
  return `${u.pathname}${u.search}`;
}

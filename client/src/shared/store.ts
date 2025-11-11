import { atom } from "jotai";

export const playerId = atom<string|null>(null);
export const health = atom<Record<string, number>>({});
export const ammo = atom(0);
export const connection = atom<WebSocket|null>(null);

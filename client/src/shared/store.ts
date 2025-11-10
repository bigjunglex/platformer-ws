import { atom } from "jotai";

export const playerId = atom<string>('');
export const health = atom<Record<string, number>>({});
export const ammo = atom(0);
export const connection = atom<WebSocket|null>(null);
/**
 * temporal check, merge with player id, establish connection = create player entitry with 
 * server sent ID
 */
export const wsId = atom<string|null>(null);
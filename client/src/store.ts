import { atom } from "jotai";

export const playerId = atom<string>('');
export const health = atom<Record<string, number>>({});
export const ammo = atom(0);
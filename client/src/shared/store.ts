import { atom } from "jotai";

export const playerId = atom<string|null>(null);
export const connection = atom<WebSocket|null>(null);
export const gameState = atom<GameState>();
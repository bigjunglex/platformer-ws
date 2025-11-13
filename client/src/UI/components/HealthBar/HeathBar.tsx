import { useAtomValue } from "jotai"
import { playerId, gameState } from "../../../shared/store"

export const HealthBar = () => {
    const id = useAtomValue(playerId)!;
    const state = useAtomValue(gameState);
    
    const health = state?.players[id]?.health;


    return (
        <h2> ♥️: { health ?? '—' }</h2>
    ) 
} 
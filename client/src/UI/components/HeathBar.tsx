import { useAtomValue } from "jotai"
import { playerId, gameState } from "../../shared/store"

export const HealthBar = () => {
    const id = useAtomValue(playerId)!;
    const state = useAtomValue(gameState);
    
    const ammo = state?.players[id]?.ammo;
    const health = state?.players[id]?.health;


    return (
        <div className="resources">
            <h2> ♥️: {health ?? '—'}</h2>
            {ammo && <h2> 🔫: {ammo} </h2> }
        </div>

    )
} 
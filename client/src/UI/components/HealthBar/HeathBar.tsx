import { useAtomValue } from "jotai"
import { health, playerId } from "../../../store"

export const HealthBar = () => {
    const id = useAtomValue(playerId)!;
    const hpStore = useAtomValue(health);
    
    return (
        <h2> ♥️: { hpStore[id] ?? '—' }</h2>
    ) 
}
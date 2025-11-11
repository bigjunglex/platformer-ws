import { Connection } from "./components/Connect/Connect";
import { HealthBar } from "./components/HealthBar/HeathBar";
import { useAtomValue } from "jotai";
import { playerId } from "../shared/store";
import initGame from "../game/setup";

export function UI() {
    const id = useAtomValue(playerId)
    
    if (id) initGame();

    return (
        <div id="ui-container">
            <Connection />
            <HealthBar />
        </div>
    )
}
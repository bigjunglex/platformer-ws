import { Connection } from "./components/Connect";
import { HealthBar } from "./components/HeathBar";
import { useAtomValue } from "jotai";
import { gameState, playerId } from "../shared/store";
import initGame from "../game/setup";
import { useEffect, useState } from "react";
import { Menu } from "./components/Menu";

export function UI() {
    const id = useAtomValue(playerId);
    const state = useAtomValue(gameState);
    const [players, setPlayers] = useState<number>(1);
    const [scene, setScene] = useState<'menu' | 'arena'>('menu')

    if (state) {
        const statePlayers = Object.keys(state?.players!).length;
        if (statePlayers !== players) { setPlayers(statePlayers); }
    }

    useEffect(() => {
        if (!id) return;
        initGame();
        setScene(players === 2 ? 'arena' : 'menu')
    }, [ players ])

    return (
        <div id="ui-container">
            <Connection />
            {scene === 'menu' ? <Menu /> : <HealthBar /> }
        </div>
    )
}
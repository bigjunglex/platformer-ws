import type { KAPLAYCtx, LoadSpriteOpt, Vec2 } from "kaplay";
import k from "./kaplayCtx";
import { makeMap, setControls } from "./utils";
import { createPlayer } from "./entities";
import { FRAMES, GRAVITY } from "./constants";
import { getDefaultStore } from "jotai";
import { playerId, connection, gameState } from "../shared/store";

const loadOptions: LoadSpriteOpt = { sliceX: 11, sliceY: 11 }

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', loadOptions);
    k.loadSprite('demo-arena',  './demo-arena.png');
    const store = getDefaultStore();
    const ownId = store.get(playerId)!
    const ws = store.get(connection)

    const { map, spawnPoints } = await makeMap(k, 'demo-arena')
    const squareSpawn = spawnPoints.square[0]!
    
    k.scene('demo-arena', () => {
        k.setGravity(GRAVITY);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        k.add(map);

        addPlayersFromState(k, store.get(gameState)!, ownId, squareSpawn)

        k.onUpdate(() => {
            if (k.get('player').length !== Object.keys(store.get(gameState)?.players!).length) {
                addPlayersFromState(k, store.get(gameState)!, ownId, squareSpawn)
            }
            // const curr = store.get(gameState)!;
            // const snapshot = JSON.stringify(curr);
            // ws?.send(snapshot)
        })
    }) 
    
    k.go('demo-arena')
}



function addPlayersFromState( k:KAPLAYCtx, state:GameState, ownId: string, spawn: Vec2) {
        for (const [id, player] of Object.entries(state?.players!)) {
            if (k.get(id).length !== 0) continue;
            const frame = FRAMES.characters[player.sprite]
            const entity = createPlayer(k, spawn, frame, id)
            k.add(entity)
            if (id === ownId) {
                setControls(k, entity)
            }
        }
}
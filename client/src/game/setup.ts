import type { LoadSpriteOpt } from "kaplay";
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
    const state = store.get(gameState)
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

        console.log(state?.players)

        for (const [id, player] of Object.entries(state?.players!)) {
            if (k.get(id).length !== 0) continue;
            const frame = FRAMES.characters[player.sprite]
            const entity = createPlayer(k, squareSpawn, frame, id)
            k.add(entity)
            k.debug.inspect
            if (id === ownId) {
                setControls(k, entity)
            }
        }
    }) 
    
    
    k.go('demo-arena')
}

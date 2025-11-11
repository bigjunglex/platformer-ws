import type { LoadSpriteOpt } from "kaplay";
import k from "./kaplayCtx";
import { getItem, makeMap, setControls } from "./utils";
import { createPlayer } from "./entities";
import { FRAMES, GRAVITY } from "./constants";
import { getDefaultStore } from "jotai";
import { playerId } from "../shared/store";

const loadOptions: LoadSpriteOpt = { sliceX: 11, sliceY: 11 }

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', loadOptions);
    k.loadSprite('demo-arena',  './demo-arena.png');
    const store = getDefaultStore();
    const id = store.get(playerId)
    
    const { map, spawnPoints } = await makeMap(k, 'demo-arena')
    const squareSpawn = spawnPoints.square[0]!
    
    k.scene('demo-arena', () => {
        k.setGravity(GRAVITY);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        const player = createPlayer(k, squareSpawn, FRAMES.characters.greenCircle, id ?? 'no connection');

        setControls(k, player);
        k.add(player);
        k.add(map);
    })

    k.go('demo-arena')
}
import type { LoadSpriteOpt } from "kaplay";
import k from "./kaplayCtx";
import { makeMap, setControls } from "./utils";
import { createPlayer } from "./entities";
import { FRAMES, GRAVITY } from "./constants";

const loadOptions: LoadSpriteOpt = { sliceX: 11, sliceY: 11 }
 

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', loadOptions);
    k.loadSprite('demo-arena',  './demo-arena.png');
    const { map, spawnPoints } = await makeMap(k, 'demo-arena')
    const squareSpawn = spawnPoints.square[0]!
    const roundSpawn = spawnPoints.round[0]!

    k.scene('demo-arena', () => {
        k.setGravity(GRAVITY);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        const player = createPlayer(k, squareSpawn, FRAMES.characters.redSquare)
        const enemy = createPlayer(k, roundSpawn, FRAMES.characters.greenCircle)

        setControls(k, player)
        k.add(player)
        k.add(enemy)
        k.add(map);
    })

    k.go('demo-arena')
}
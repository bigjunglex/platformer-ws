import type { LoadSpriteOpt } from "kaplay";
import k from "./kaplayCtx";
import { makeMap } from "./utils";
import { createPlayer, setControls } from "./entities";

const options: LoadSpriteOpt = {
    sliceX: 11,
    sliceY: 11,
    anims: {
        yellowSqyare: { from: 9, to: 9},
        redSquare: { from: 20, to: 20},
        purpleSquare: { from: 31, to: 31 },
        greenSquare: { from: 42, to: 42},
    }
}
 

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', options)
    const x = k.loadSprite('demo-arena',  './demo-arena.png')

    console.log(x)
    const { map, spawnPoints } = await makeMap(k, 'demo-arena')

    k.scene('demo-arena', () => {
        k.setGravity(1400);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        const player = createPlayer(k, k.vec2(0, 0), 'greenSquare')
        setControls(k, player)
        k.add(player)
        k.add(map);
    })

    k.go('demo-arena')
}
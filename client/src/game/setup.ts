import type { LoadSpriteOpt } from "kaplay";
import k from "./kaplayCtx";
import { makeMap } from "./utils";

const options: LoadSpriteOpt = {
    sliceX: 11,
    sliceY: 11,
    anims: {
        purpleSquare: { from: 31, to: 31 }
    }
}


export default async function initGame() {
    k.loadSprite('assets', './scribble.png', options)
    const x = k.loadSprite('demo-arena',  './demo-arena.png')

    console.log(x)
    const { map, spawnPoints } = await makeMap(k, 'demo-arena')

    k.scene('demo-arena', () => {
        k.setGravity(2000);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])

        k.add(map);
    })

    k.go('demo-arena')
}
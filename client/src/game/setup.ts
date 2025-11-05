import type { LoadSpriteOpt } from "kaplay";
import k from "./kaplayCtx";
import { makeMap, setControls } from "./utils";
import { createPlayer } from "./entities";
import { FRAMES, ITEM_OFFSETS, GRAVITY } from "./constants";

const options: LoadSpriteOpt = {
    sliceX: 11,
    sliceY: 11,
}
 

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', options);
    k.loadSprite('demo-arena',  './demo-arena.png');
    const { map, spawnPoints } = await makeMap(k, 'demo-arena')
    const squareSpawn = spawnPoints.square[0]!
    
    k.scene('demo-arena', () => {
        k.setGravity(GRAVITY);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        const player = createPlayer(k, squareSpawn, FRAMES.characters.greenCircle)
        const weapon = k.make([
            k.sprite('assets', { frame: FRAMES.weapons.sword }),
            k.area({ shape: new k.Rect(k.vec2(15,0), 32, 64)}),
            k.pos(0),
            k.anchor('botleft'),
            k.rotate(15),
            'melee'
        ])
        const armor = k.make([
            k.sprite('assets', { frame: FRAMES.armor.helmet }),
            k.pos(ITEM_OFFSETS.armor.helmet.x, ITEM_OFFSETS.armor.helmet.y),
            k.anchor('bot')
        ])

        player.add(armor)
        player.add(weapon)
        setControls(k, player)
        k.add(player)
        k.add(map);
    })

    k.go('demo-arena')
}
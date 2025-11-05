import type { AnchorComp, AreaComp, GameObj, KAPLAYCtx, PosComp, SpriteComp, Vec2 } from "kaplay";
import { backFlip } from "./utils";

export type Player = ReturnType<typeof createPlayer>
export type Weapon = GameObj<SpriteComp | AreaComp | PosComp | AnchorComp> | null

export function createPlayer(k: KAPLAYCtx, pos: Vec2, frame: number) {
    const player = k.make([
        k.sprite('assets', { frame: frame }),
        k.area({ shape: new k.Rect(k.vec2(0,0), 32, 64) }),
        k.body(),
        k.pos(pos),
        k.health(3),
        k.opacity(1),
        k.doubleJump(1),
        k.rotate(),
        k.anchor('center'),
        {
            speed: 300,
            id: frame,
            direction: 'right',
        },
        'player'
    ])

    player.onCollide('hazard', async () => {
        if (player.hp() === 1) {
            k.destroy(player)
            return;;
        }
        player.hurt();
        player.jump(800)
        backFlip(k, player)
        await k.tween(
            player.opacity,
            0,
            0.05,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            1,
            0.05,
            (val) => (player.opacity = val),
            k.easings.linear
        )
    })

    player.on('attack', (args) => {
        console.log(player.children.find(c => c.tags.includes('melee')))
    })

    return player
}


export function createMeleeWeapon(k: KAPLAYCtx, anim: string) {
    const weapon = k.make([
        
    ])
}



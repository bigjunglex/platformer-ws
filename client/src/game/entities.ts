import type { KAPLAYCtx, Vec2 } from "kaplay";
import { backFlip } from "./utils";

export type Player = ReturnType<typeof createPlayer>

export function createPlayer(k: KAPLAYCtx, pos: Vec2, anim: string) {
    const player = k.make([
        k.sprite('assets', { anim }),
        k.area({ shape: new k.Rect(k.vec2(16,0), 32, 64) }),
        k.body(),
        k.pos(pos),
        k.health(3),
        k.opacity(1),
        k.doubleJump(1),
        k.rotate(),
        k.anchor('center'),
        {
            speed: 300,
            id: anim,
            direction: 'right'
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

    return player
}


export function setControls(k: KAPLAYCtx, player: Player) {

    k.onKeyDown((key) => {
        switch (key) {
            case "left":
                player.direction = 'left';
                player.flipX = true;
                player.move(-player.speed, 0);
                break;
            case "right":
                player.direction = 'right';
                player.flipX = false;
                player.move(player.speed, 0);
                break;
            case 'z':
                console.log('attack')
                break;
            default:
        }
    })

    k.onKeyPress((key) => key === 'x' ? player.doubleJump() : null)

}
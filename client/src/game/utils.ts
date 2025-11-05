import type { KAPLAYCtx, Vec2 } from "kaplay";
import type { Player } from "./entities";

export async function makeMap(k: KAPLAYCtx, name: string) {
    const mapData = await (await fetch(`./${name}.json`)).json();
    const map = k.make([ k.sprite(name), k.pos(0) ]);
    
    const spawnPoints: {[key:string]: Vec2[]} = {};

    for (const layer of mapData.layers) {
        if (layer.name === 'colliders') {
            for (const collider of layer.objects) {
                map.add([
                    k.area({
                        shape: new k.Rect(
                            k.vec2(0),
                            collider.width,
                            collider.height
                        ),
                        collisionIgnore: ['platform', 'hazard'],
                    }),
                    k.body({ isStatic: true }),
                    k.pos(collider.x, collider.y),
                    collider.name !== 'hazard' ? 'platform' : 'hazard',
                ])
            }
            continue
        }

        if (layer.name === 'spawnpoints') {
            for (const spawn of layer.objects) {
                if (spawnPoints[spawn.name]) {
                    spawnPoints[spawn.name].push(k.vec2(spawn.x, spawn.y))
                    continue;
                }

                spawnPoints[spawn.name] = [ k.vec2(spawn.x, spawn.y) ]
            }
        }
    }

    return { map, spawnPoints }
}

export function setControls(k: KAPLAYCtx, player: Player) {
    k.onKeyDown((key) => {
        switch (key) {
            case "left":
                player.direction = 'left';
                player.flipX = true;
                
                for (const c of player.children) {
                    if (c.tags.includes('melee')) null
                    c.flipX = true;
                }

                player.move(-player.speed, 0);
                break;
            case "right":
                player.direction = 'right';
                player.flipX = false;

                for (const c of player.children) {
                    if (c.tags.includes('melee')) console.log('melee weapon')
                    c.flipX = false;
                }

                player.move(player.speed, 0);
                break;
            case 'z':
                break;
            default:
        }
    })

    k.onKeyPress((key) => key === 'x' ? player.doubleJump() : null)
    k.onKeyPress((key) => key === 'c' ? player.trigger('attack') : null)
}


export async function backFlip(k: KAPLAYCtx, player: Player) {
    await k.tween(
        player.angle,
        360,
        0.5,
        (a) => player.angle = a,
        k.easings.linear
    )
    player.angle = 0;
}
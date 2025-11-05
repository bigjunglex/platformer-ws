import type { KAPLAYCtx, Vec2 } from "kaplay";
import type { Item, Player } from "./entities";
import { FRAMES, HITBOXES } from "./constants";

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

        if (layer.name === 'weapons') {
            for (const weapon of layer.objects) {
                const name = weapon.name as string
                map.add([
                    k.sprite('assets', { frame: FRAMES.weapons[name]}),
                    k.area({
                        shape: new k.Rect(
                            k.vec2(0),
                            HITBOXES.weapons[name].width,
                            HITBOXES.weapons[name].height
                        )
                    }),
                    k.pos(weapon.x, weapon.y),
                    k.anchor('bot'),
                    'item', 'weapon', name
                ])
            }
        }

        if (layer.name === 'armor') {
            for (const armor of layer.objects) {
                const name = armor.name as string
                map.add([
                    k.sprite('assets', { frame: FRAMES.armor[name]}),
                      k.area({
                        shape: new k.Rect(
                            k.vec2(0),
                            HITBOXES?.armor?.[name].width ?? 64,
                            HITBOXES?.armor?.[name].height ?? 64
                        )
                    }),
                    k.pos(armor.x, armor.y),
                    k.anchor('bot'),
                    'item', 'armor', name
                ])
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
                
                for (const c of player.children as Item[]) {
                    c.flipX = true;
                }

                player.move(-player.speed, 0);
                break;
            case "right":
                player.direction = 'right';
                player.flipX = false;

                for (const c of player.children as Item[]) {
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
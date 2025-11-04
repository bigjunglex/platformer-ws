import type { KAPLAYCtx, Vec2 } from "kaplay";

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
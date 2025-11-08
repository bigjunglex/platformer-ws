import type { AnchorComp, AreaComp, Collision, GameObj, KAPLAYCtx, PosComp, Rect, RotateComp, SpriteComp, Vec2 } from "kaplay";
import { backFlip } from "./utils";
import { FRAMES, HITBOXES, ITEM_OFFSETS, type ItemOffset } from "./constants";
import {  health } from "../store";
import { getDefaultStore } from "jotai";

export type Player = ReturnType<typeof createPlayer>
export type Item = GameObj<SpriteComp | AreaComp | PosComp | RotateComp | AnchorComp | null>

export function createPlayer( k: KAPLAYCtx, pos: Vec2, frame: number) {
    const store = getDefaultStore();
    const id = crypto.randomUUID().substring(0, 6)

    const player = k.make([
        k.sprite('assets', { frame: frame }),
        k.area({ shape: new k.Rect(k.vec2(0,0), 32, 64) }),
        k.body(),
        k.pos(pos),
        k.health(5),
        k.opacity(1),
        k.doubleJump(1),
        k.rotate(),
        k.anchor('center'),
        {
            speed: 300,
            direction: 'right',
            bigid: id,
            isAttacking: false,
            attack: async function() {
                const player = this as Player;
                const weapon = player.children.find(c => c.tags.includes('weapon'))


                if (weapon && !player.isAttacking) {
                    player.isAttacking = true;
                    const startingPoint = weapon.angle
                    const returnPoint = player.direction === 'right' ? startingPoint + 50 : startingPoint - 50;
                    const swingPoint = player.direction === 'right' ? startingPoint - 40 : startingPoint + 40;

                    await k.tween(
                        startingPoint,
                        swingPoint,
                        0.3,
                        (v) => weapon.angle = v
                    )
                    await k.tween(
                        swingPoint,
                        startingPoint,
                        0.1,
                        (v) => weapon.angle = v
                    )

                    await k.tween(
                        startingPoint,
                        returnPoint,
                        0.1,
                        (v) => weapon.angle = v
                    )
                    await k.tween(
                        returnPoint,
                        startingPoint,
                        0.3,
                        (v) => weapon.angle = v
                    )
                    player.isAttacking = false

                } 
            }
        },
        'player',
        id
    ])

    
    
    const updateHealth = () => store.set(health, {...store.get(health), [id]: player.hp()});

    player.onAdd(updateHealth)
    player.on('hurt', updateHealth)
    player.on('heal', updateHealth)

    player.on('hurt', async () => {
        await k.tween(
            player.opacity,
            0,
            0.1,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            1,
            0.1,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            0,
            0.1,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            1,
            0.1,
            (val) => (player.opacity = val),
            k.easings.linear
        )
    })

    
    player.onCollide('hazard', async () => {
        player.hurt();
        player.jump(800)
        backFlip(k, player)
    })

    player.onCollide('item', (item) => {
        let type: string;
        let offset: ItemOffset; 
        let shape: null | Rect;
        let frame: number; 
        let isWeapon: boolean;
        /**
         * mb add array of ids of created items to implement :
         *  collide with item id => search item by id => remove item form map => add to player
         * 
         * so no new object reused ? <<<<<<
         */
        if (item.tags.includes('weapon')) {
            type = item.tags.find(t => t !== 'item' && t !== 'weapon' && t !== '*') ?? 'sword';
            frame = FRAMES.weapons[type];
            offset = ITEM_OFFSETS.weapons[type];
            shape = new k.Rect(
                k.vec2(HITBOXES.weapons[type].vec.x, HITBOXES.weapons[type].vec.y),
                HITBOXES.weapons[type].width,
                HITBOXES.weapons[type].height,
            )
            isWeapon = true;
        } else {
            type = item.tags.find(t => t !== 'item' && t !== 'armor' && t !== '*') ?? 'helmet_flat';
            frame = FRAMES.armor[type];
            offset = ITEM_OFFSETS.armor[type];
            shape = null;
            isWeapon = false;
        }

        const newItem = player.add([
            k.sprite('assets', { frame }),
            shape ? k.area({ shape }) : '',
            k.pos(offset.vec.x, offset.vec.y),
            k.anchor(offset.anchor),
            k.rotate(offset.angle),
            isWeapon ? 'weapon' : 'armor',
            type
        ]!)

        if (isWeapon) {
            newItem.onUpdate(() => {
                if (player.direction === 'left') {
                    if (newItem.anchor === 'botleft') {
                        newItem.anchor = 'botright';
                    }
                    if (newItem.angle > 0) {
                        newItem.angle = -offset.angle
                    }
                    if (newItem.area.offset.x === 0) {
                        newItem.area.offset.x = newItem.area.offset.x - newItem.width / 2
                    }
                    return;
                }
                newItem.area.offset.x = 0;
                newItem.angle = offset.angle;
                newItem.anchor = 'botleft';
            })

            newItem.onCollide('player', (col: GameObj<any>) => {
                if (col.id !== player.id) {
                    col.hurt()
                    console.log(col.hp())
                }
            })
        }
            
        item.destroy();
    })

    

    player.onUpdate(() => {
        if (player.hp() === 0) {
            k.destroy(player)
            return;;
        }
    })

    return player
}

import type { AnchorComp, AreaComp, GameObj, KAPLAYCtx, PosComp, Rect, RotateComp, SpriteComp, Vec2 } from "kaplay";
import { backFlip } from "./utils";
import { FRAMES, HITBOXES, ITEM_OFFSETS, type ItemOffset } from "./constants";

export type Player = ReturnType<typeof createPlayer>
export type Item = GameObj<SpriteComp | AreaComp | PosComp | RotateComp | AnchorComp | null>

export function createPlayer( k: KAPLAYCtx, pos: Vec2, frame: number ) {
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
            type = item.tags.find(t => t !== 'item' && t !== 'weapon' && t !== '*' ) ?? 'sword';
            frame = FRAMES.weapons[type];
            offset = ITEM_OFFSETS.weapons[type];
            shape = new k.Rect(
                k.vec2(HITBOXES.weapons[type].vec.x, HITBOXES.weapons[type].vec.y),
                HITBOXES.weapons[type].width,
                HITBOXES.weapons[type].height,
            )
            isWeapon = true;
        } else {
            type = item.tags.find(tag => tag !== 'item' && tag !== 'armor') ?? 'helmet_flat';
            frame = FRAMES.armor[type];
            offset = ITEM_OFFSETS.armor[type];
            shape = null;
            isWeapon = false;
        }

        const newItem = player.add([
            k.sprite('assets', { frame }),
            shape ? k.area({ shape }) : null,
            k.pos(offset.vec.x, offset.vec.y),
            k.anchor(offset.anchor),
            k.rotate(offset.angle),
            isWeapon ? 'weapon' : 'armor',
            type
        ])

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

        item.destroy();
    })


    return player
}



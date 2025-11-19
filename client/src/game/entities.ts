import { type AnchorComp, type AreaComp, type GameObj, type KAPLAYCtx, type PosComp, type Rect, type RotateComp, type SpriteComp, type Vec2 } from "kaplay";
import { backFlip } from "./utils";
import { FRAMES, HITBOXES, ITEM_OFFSETS, type ItemOffset } from "./constants";
import { getDefaultStore } from "jotai";
import { gameState, playerId } from "../shared/store";

export type Player = ReturnType<typeof createPlayer>
export type Item = GameObj<SpriteComp | AreaComp | PosComp | RotateComp | AnchorComp | null>  & { attack?: () => Promise<void>|void; }
export type PlayerParam = Parameters<typeof createPlayer>

export function createPlayer( k: KAPLAYCtx, pos: Vec2, frame: number, id: string) {
    const store = getDefaultStore();
    const ownId = store.get(playerId);
    console.log(ownId)
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
            ammo: null as null|number,
            weapon: null as Item|null,
            attack: async function() {
                const player = this as Player;
                const weapon = player.children.find(c => c.tags.includes('weapon'));
                await weapon?.attack();
            }
        },
        'player',
        id
    ])


    player.on('hurt', async () => {
        await k.tween(
            player.opacity,
            0,
            0.2,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            1,
            0.2,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            0,
            0.2,
            (val) => (player.opacity = val),
            k.easings.linear
        )
        await k.tween(
            player.opacity,
            1,
            0.2,
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

        if ( type === 'gun' || type === 'pistol' ) {
            const prev = store.get(gameState)!;
            prev.players[id].ammo = 5;
            store.set(gameState, prev)
        }

        const newItem:Item  = player.add([
            k.sprite('assets', { frame }),
            shape ? k.area({ shape }) : '',
            k.pos(offset.vec.x, offset.vec.y),
            k.anchor(offset.anchor),
            k.rotate(offset.angle),
            isWeapon ? 'weapon' : 'armor',
            type
        ]!)

        if (isWeapon) {
            player.weapon = newItem; // <____TEST SYNC

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

            if (newItem.tags.includes('sword')) {
                newItem.attack = getMeleeAttack(k, player, newItem)
                newItem.onCollide('player', (col: GameObj<any>) => {
                    if (col.id !== player.id) {
                        col.hurt()
                        console.log(col.hp())
                    }
                })
            }

            if (newItem.tags.includes('gun') || newItem.tags.includes('pistol')) {
                newItem.attack = getRangedAttack(k, player, newItem)
                newItem.tag('ranged');                
                newItem.collisionIgnore = ['*'];

            }
        }
            
        item.destroy();
    })



    player.onUpdate(() => {
        if (player.hp() === 0) {
            k.destroy(player)
            return
        }

        const prev = store.get(gameState)!;
        const playerState = prev.players[id]

        if (id === ownId) {
            playerState.pos = { x: player.pos.x, y: player.pos.y };
            playerState.direction = player.direction as 'right' | 'left';
            playerState.isAttacking = player.isAttacking;
            playerState.health = player.hp();
            playerState.ammo = player.ammo;
        } 

        store.set(gameState, prev)
    })

    return player
}

function getMeleeAttack(k: KAPLAYCtx, player: Player, weapon: Item) {
    return async function () {
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
}

function getRangedAttack(k: KAPLAYCtx, player: Player, weapon: Item) {
    return async function () {
        if (weapon && !player.isAttacking) {
            player.isAttacking = true;
            const bullet = createBullet(k, player.direction as 'left'|'right');
            bullet.pos = player.pos;
            k.add(bullet)
            bullet.onCollide((obj) => {
                if ( obj?.bigid !== player.bigid ) {
                    if (obj.tags.includes('player')){ 
                        obj.hurt();
                        console.log(obj.hp())
                    }
                    bullet.destroy();
                }
            })

            if (player.ammo) player.ammo - 1;

            const startingPoint = weapon.angle
            const swingPoint = player.direction === 'right' ? startingPoint - 30 : startingPoint + 30;

            await k.tween(
                startingPoint,
                swingPoint,
                0.2,
                (v) => weapon.angle = v
            )
            await k.tween(
                swingPoint,
                startingPoint,
                0.4,
                (v) => weapon.angle = v
            )
            player.isAttacking = false
        }
    }
}

function createBullet(k:KAPLAYCtx, direction: 'left' | 'right') {
    const hitbox = HITBOXES.projectiles.bullet;
    const bullet = k.make([
        k.sprite('assets', { frame: FRAMES.projectile.bullet }),
        k.area({
            shape: new k.Rect(
                k.vec2(hitbox.vec.x, hitbox.vec.y),
                hitbox.width,
                hitbox.height
            ),
            collisionIgnore: ['weapon', 'item', 'hazard']
        }
        ),
        k.anchor('center'),
        k.pos(),
        direction === 'right' ? k.move(k.RIGHT, 600) : k.move(k.LEFT, 600)
    ])

    return bullet
}

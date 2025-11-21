import type { KAPLAYCtx, LoadSpriteOpt, Vec2 } from "kaplay";
import k from "./kaplayCtx";
import { makeMap, setControls } from "./utils";
import { createPlayer, type Player } from "./entities";
import { FRAMES, GRAVITY } from "./constants";
import { getDefaultStore } from "jotai";
import { playerId, connection, gameState } from "../shared/store";

const loadOptions: LoadSpriteOpt = { sliceX: 11, sliceY: 11 }

export default async function initGame() {
    k.loadSprite('assets', './scribble.png', loadOptions);
    k.loadSprite('demo-arena',  './demo-arena.png');
    const store = getDefaultStore();
    const ownId = store.get(playerId)!
    const ws = store.get(connection)

    k.scene('menu', () => {
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ]);
        
        const arenaWidth = 1152;
        const background = [
            k.add([k.sprite('demo-arena'), k.pos(0, 160)]),
            k.add([k.sprite('demo-arena'), k.pos(arenaWidth, 160)])
        ]
        
        k.onUpdate(() => {
            if (background[1].pos.x < 0) {
                background[0].moveTo(background[1].pos.x + arenaWidth, 0);
                const frontBgPiece = background.shift();
                if (frontBgPiece) background.push(frontBgPiece);
            }

            background[0].move(-200, 0);
            background[1].moveTo(background[0].pos.x + arenaWidth, 0);
        })
    })

    const { map, spawnPoints } = await makeMap(k, 'demo-arena')
    const squareSpawn = spawnPoints.square[0]!

    let attackTimeout = false;
    const enableAttack = () => attackTimeout = false;

    k.scene('demo-arena', () => {
        k.setGravity(GRAVITY);
        k.add([
            k.rect(k.width(), k.height()),
            k.color(k.Color.fromHex('#ececec')),
            k.fixed(),
        ])
        k.add(map);

        addPlayersFromState(k, store.get(gameState)!, ownId, squareSpawn)

        k.onUpdate(() => {
            const players = k.get('player');
            const state = store.get(gameState);
            const ids = Object.keys(state?.players!);
            
            if (players.length !== ids.length) {
                if (players.length < ids.length && players.length < 2) {
                    addPlayersFromState(k, store.get(gameState)!, ownId, squareSpawn);
                }
            }

            if (players.length > 1 && ids.length > 1) {
                const enemy = k.get('enemy')[0] as Player;
                const enemyState = state?.players[enemy.bigid];
                const enemyVec = new k.Vec2(enemyState?.pos.x, enemyState?.pos.y);
                const enemyAmmo = enemyState?.ammo!;
                const enemyHp = enemyState?.health!;
                const dir = enemyState?.direction!
                if  (dir === 'right') {
                    enemy.flipX = false
                    for (const c of enemy.children) {
                        c.flipX = false
                    }
                } else {
                    enemy.flipX = true
                    for (const c of enemy.children) {
                        c.flipX = true
                    }
                }
                enemy.direction = dir
                enemy.moveTo(enemyVec)
                enemy.setHP(enemyHp)
                enemy.ammo = enemyAmmo

                // go biggaz
                if (enemyState?.isAttacking && !attackTimeout) {
                    enemy.attack()
                    attackTimeout = true;
                    setTimeout(enableAttack, 500)
                }
            }
            
            ws?.send(JSON.stringify(store.get(gameState)?.players[ownId]))
        })
    }) 
    
    if (Object.keys(store.get(gameState)?.players!).length === 2) {
        k.go('demo-arena')
    } else {
        k.go('menu')
    }
}

function addPlayersFromState(k: KAPLAYCtx, state: GameState, ownId: string, spawn: Vec2) {
    for (const [id, player] of Object.entries(state?.players!)) {
        if (k.get(id).length !== 0 || !player) continue;
        const frame = FRAMES.characters[player.sprite]
        const entity = createPlayer(k, spawn, frame, id)
        if (id === ownId) {
            setControls(k, entity)
        } else {
            entity.tag('enemy')
        }
        k.add(entity)
    }
}

import { WebSocketServer, type WebSocket } from "ws";

type User = { ws: WebSocket, id: string }

type Position = {
    x: number;
    y: number;
}

type Player = {
    pos: Position;
    direction: 'right' | 'left';
    health: number;
    ammo: number | null;
    sprite: string;
    isAttacking: boolean;
}

type Loot = {
    pos: Position;
    sprite: string;
    tags: string[];
}

type GameState = {
    players: { [key: string]: Player };
    loot: Loot[];
}

type Ready = { [key: string]: boolean }

type Room = {
    users: [User?, User?];
    state: GameState;
    id: string;
    ready: Ready[];
}

const port:number = 3333;

const sprites = [
    'yellowSquare',
    'redSquare',
    'purpleSquare',
    'greenSquare',
    'yellowCircle',
    'redCircle',
    'purpleCircle',
    'greenCircle'
]  

let i = sprites.length;


let tick = 0;
const rooms: Room[] = [];

const wss = new WebSocketServer({ port });
wss.on('connection', (ws: WebSocket) => {
    const id = generateID();
    const roomId = generateID();
    //sprite kostil'
    const sprite = sprites[--i];
    if (i === 0) { i = sprites.length }

    const user: User = { ws, id };
    // nado norm rooms sdelat' budet
    let room:Room = rooms.find(r => r.users.length === 1)!;


    if (!room) {
        const state = createState();
        state.players[id] = {
            pos: { x: 0, y: 0 },
            direction: 'right',
            health: 5,
            ammo: null,
            sprite,
            isAttacking: false,
        }

        room = {
            users: [ user ],
            id: roomId,
            state,
            ready: []
        }
        room.ready.push({ [id]: false} )
        rooms.push(room)
    } else {
        room.state.players[id] = {
            pos: { x: 0, y: 0 },
            direction: 'right',
            health: 5,
            sprite,
            ammo: null,
            isAttacking: false,
        }
        
        room.ready.push({ [id]: false} )
        room.users.push(user)
    }
    
    const response = JSON.stringify(room.state) + '||' + id 
    ws.send(response)

    for (const user of room.users) {
        user?.ws.send(JSON.stringify(room.state))
    }
    
    ws.on('close', () => {
        const idx = room.users.findIndex(u => u?.id === id);
        room.users.splice(idx, 1);
        delete room.state.players[id];

        for (const user of room.users) {
            tick = 0;
            console.log('[%s] RESET ', tick, user!.id)
            user?.ws.send(JSON.stringify(room.state))
        }
    })

    ws.on('error', console.error);
    ws.on('message', (data) => {
        const snapshot = JSON.parse(data.toString()) as Player;
        room.state.players[id] = snapshot;
        room.ready.find(c => c.hasOwnProperty(id))![id] = true;
        
        const check = room.ready.every(c => !Object.entries(c)[1]) && room.users.length === 2

        if (!check) return;

        if (check) {
            for (const user of room.users) {
                console.log('[%s] send to ', tick, user!.id)
                tick++
                user?.ws.send(JSON.stringify(room.state))
            }

            room.ready.forEach(r => {
                const [ k ] = Object.keys(r);
                r[k] = false
            })
        }
    })
})

wss.on('listening', () => {
    console.log('[WEBSOCKET]: Lisening on %s', port)
})

function generateID() {
    return crypto.randomUUID().substring(0, 7)
}
 
function createState(): GameState {
    return {
        players: {},
        loot: []
    }
}
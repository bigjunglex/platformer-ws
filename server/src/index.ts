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

type Room = {
    users: [User?, User?];
    state: GameState;
    id: string;
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
            sprite,
            isAttacking: false,
        }

        room = {
            users: [ user ],
            id: roomId,
            state
        }
        rooms.push(room)
    } else {
        room.state.players[id] = {
            pos: { x: 0, y: 0 },
            direction: 'right',
            health: 5,
            sprite,
            isAttacking: false,
        }

        room.users.push(user)
    }
    
    const response = JSON.stringify(room.state) + '||' + id 
    ws.send(response)

    for (const user of room.users) {
        user?.ws.send(JSON.stringify(room.state))
    }
    
    ws.on('error', console.error);
    ws.on('message', (data) => {
        const snapshot = JSON.parse(data.toString()) as GameState;
        // vozmojno big problema 
        room.state.players = {
            ...room.state.players,
            [id]: snapshot.players[id]
        }

        if (room.users.length < 2) return;
        
        for (const user of room.users) {
            if (user?.id !== id) {
                user?.ws.send(JSON.stringify(room.state))
            }
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
import { WebSocketServer, type WebSocket} from "ws";

type User = { ws: WebSocket, id: string }

type Position = {
    x: number;
    y: number;
}

type Player = {
    pos: Position;
    health: number;
    sprite: string;
    
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
    //rewrite in spritegetter
    const sprite = sprites[--i];
    if (i === 0) {
        i = sprites.length
    }

    const user: User = { ws, id };

    //rewrite in roomfinder
    let room:Room = rooms.find(r => r.users.length === 1)!;

    if (!room) {
        const state = createState();
        state.players[id] = {
            pos: { x: 0, y: 0 },
            health: 5,
            sprite
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
            health: 5,
            sprite
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
        const snapshot = JSON.parse(data.toString());
        room.state = snapshot
        if (room.users.length < 2) return;
        
        for (const user of room.users) {
            user?.ws.send(data.toString())
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
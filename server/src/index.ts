import http from "node:http";
import { WebSocketServer, type WebSocket } from "ws";

type Request = typeof http.IncomingMessage;
type Response = typeof http.ServerResponse;
type User = { ws: WebSocket, id: string }

const port = 3333;

// class WebsocketServer {
//     public port: number;
//     server: http.Server<Request, Response>;
//     wss: WebSocket.Server<typeof WebSocket, Request>

//     constructor(port: number) {
//         this.port = port;
//         this.server = http.createServer();
//         this.wss = new WebSocket.Server({
//             server: this.server,
//             clientTracking: true
//         })
//     }
    
// }

const connections: User[] = [];

const wss = new WebSocketServer({ port });
wss.on('connection', (ws: WebSocket) => {
    const id = generateID();
    const conn: User = { ws, id };
    connections.push(conn)    

    ws.on('error', console.error);
    ws.on('message', (data) => {
        console.log('recieved: %s', data)
        ws.send(`[RESPONSE]: ${data}`)
    })
        
    ws.send(id)

    console.log('[USERS]: new User { %s }', id)
    console.log('[USERS]: All users \n %s ', connections.map(user => user.id))
})

wss.on('listening', () => {
    console.log('[WEBSOCKET]: Lisening on %s', port)
})

function generateID() {
    return crypto.randomUUID().substring(0, 7)
}
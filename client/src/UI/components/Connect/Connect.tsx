import { useAtom } from "jotai";
import { connection, playerId, gameState } from "../../../shared/store";
import { useEffect,  useState } from "react";

export function Connection() {
    const [ws, setWs] = useAtom(connection);
    const [id, setId] = useAtom(playerId);
    const [_, setGState] = useAtom(gameState)
    const [connected, setConnected] = useState(false)
    const url = import.meta.env.VITE_WS_URL;

    useEffect(() => {
        if ( connected ) return;
        const connection = new WebSocket(url);
        let gotId = false;

        connection.onopen = () => {
            setWs(connection)
            setConnected(true)
        };
        connection.onclose = () => setWs(null);
        connection.onmessage = ( event ) => {
            const data = event.data;
            if ( !gotId ) {
                const [state, id] = data.split('||')
                const snapshot = JSON.parse(state)
                console.log(snapshot, id)
                setId(id);
                setGState(snapshot)
                gotId = true;
            } else {
                const snapshot = JSON.parse(data) as GameState;
                setGState(snapshot)
                for (const [id, player] of Object.entries(snapshot.players)) {
                    console.log('[STATE]: %s --- %s', id, JSON.stringify(player.pos))
                }
            }
            

        }

        return () => {
            if (connection.readyState < 2) {
                setId(null);
                setConnected(false);
                connection.close();
            }
        }
    }, [])

    return (
        <span>{ ws && id ? id : 'Getting connection...'}</span>
    )
}
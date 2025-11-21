import { useAtom } from "jotai";
import { connection, playerId, gameState } from "../../shared/store";
import { useEffect,  useState } from "react";

export function Connection() {
    const [ws, setWs] = useAtom(connection);
    const [ownId, setOwnId] = useAtom(playerId);
    const [, setGState] = useAtom(gameState)
    const [connected, setConnected] = useState(false)
    const url = import.meta.env.VITE_WS_URL;

    useEffect(() => {
        if ( connected ) return;
        const connection = new WebSocket(url);
        let gotId:string;
    
        connection.onopen = () => {
            setWs(connection)
            setConnected(true)
        };
        connection.onclose = () => setWs(null);
        connection.onmessage = ( event ) => {
            const data = event.data;
            if ( !gotId ) {
                const [ state, id ] = data.split('||')
                const snapshot = JSON.parse(state)
                console.log(snapshot, id)
                setOwnId(id);
                setGState(snapshot)
                gotId = id;
            } else {
                const snapshot = JSON.parse(data) as GameState;
                const enemyStateId = Object.keys(snapshot.players).find(k => k !== gotId)!;

                if (enemyStateId) {
                    setGState(prev => ({
                        players: {
                            [gotId]: prev?.players[gotId]!,
                            [enemyStateId]: snapshot.players[enemyStateId]
                        },
                        loot: prev?.loot!
                    }))
                } else {
                    setGState(snapshot)
                }
            }
        }

        return () => {
            if (connection.readyState < 2) {
                setConnected(false);
                connection.close();
            }
        }
    }, [])

    return (
        <span>{ ws && ownId ? 'ID: ' + ownId : 'Getting connection...'} </span>
    )
}
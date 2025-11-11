import { useAtom } from "jotai";
import { connection, playerId } from "../../../shared/store";
import { useEffect, useState } from "react";

export function Connection() {
    const [ws, setWs] = useAtom(connection);
    const [id, setId] = useAtom(playerId);
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
                setId(data);
                gotId = true;
                console.log('[ID]: %s', data)
                return;
            }

            console.log('[RECIEVED]: %s', data)
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
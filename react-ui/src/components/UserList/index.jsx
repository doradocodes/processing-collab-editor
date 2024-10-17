import {useEffect, useState} from "react";
import {useWebsocketStore} from "../../store/websocketStore.js";

function UserList() {
    const [users, setUsers] = useState(new Map());
    const provider = useWebsocketStore(state => state.provider);

    useEffect(() => {
        // Get all users' states (including the current user)
        // const users = provider.awareness.getStates(); // This returns a Map of client IDs and their states
        //
        // // Log all users in the socket
        // console.log('Connected users:', users);

        // Optionally, listen for awareness updates (like when users join or leave)
        if (provider) {
            provider.awareness.on('change', (changes, origin) => {
                console.log('Awareness updated:', provider.awareness.getStates());
                setUsers(provider.awareness.getStates());
            });
        }


    }, [provider]);
    return provider && <div>
        {users.values().map((obj) => {
            return <div>{obj.user.name}</div>
        })}
    </div>
}

export default UserList;

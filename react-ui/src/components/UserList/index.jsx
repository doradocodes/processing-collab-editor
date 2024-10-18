import React, {useEffect, useState} from "react";
import {useWebsocketStore} from "../../store/websocketStore.js";
import {Flex, Text} from "@radix-ui/themes";
import * as Avatar from "@radix-ui/react-avatar";
import styles from "./index.module.css";


function UserList() {
    const [users, setUsers] = useState({});
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
                setUsers(Object.fromEntries(provider.awareness.getStates()));
            });
        }


    }, [provider]);

    console.log('users', users)
    return <div>
        <Text size="1" className={styles.subheader}>Collaborating with</Text>
        {provider && <Flex gap="1" wrap="wrap" mt="2">
            {Object.values(users).map((user, i) => {
                return <Avatar.Root key={i} className={styles.Root} style={{ borderColor: user.user.color, backgroundColor: user.user.colorLight }}>
                    <Avatar.Fallback className={styles.Fallback}>{user.user.name.slice(0, 1)}</Avatar.Fallback>
                </Avatar.Root>
            })}
        </Flex>
        }
    </div>

}

export default UserList;

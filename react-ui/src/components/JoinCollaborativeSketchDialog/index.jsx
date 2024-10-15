import React, {createRef, useState} from 'react';
import {Cross2Icon, FileIcon, PersonIcon} from '@radix-ui/react-icons';
import styles from './index.module.css';
import {Button, Flex, Text, TextField, Dialog} from "@radix-ui/themes";
import {getSketchFolders, updateSketch} from "../../utils/localStorageUtils.js";
import {useEditorStore} from "../../store/editorStore.js";
import {WebsocketProvider} from "y-websocket";
import {useWebsocketStore, websocketServer} from "../../store/websocketStore.js";
import * as Y from "yjs";

const JoinCollaborativeSketchDialog = ({ trigger, onClick, onSubmit, isOpen, onClose }) => {
    const [error, setError] = useState(null);

    const userNameInput = createRef();
    const sketchNameInput = createRef();

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const setProvider = useWebsocketStore(state => state.setProvider);
    const setYDoc = useWebsocketStore(state => state.setYDoc);

    const onCloseDialog = () => {
        setError(null);
        onClose();
    };

    const joinSketch = async (event) => {
        const roomID = sketchNameInput.current.value;
        if (!roomID) {
            return;
        }

        const userName = userNameInput.current.value;

        console.log('username:', userName)
        console.log('Joining sketch:', roomID);

        const ydoc = new Y.Doc();
        // let provider = new WebsocketProvider(websocketServer, roomID  + "/peer", ydoc);
        const provider = new WebsocketProvider(websocketServer, roomID, ydoc);

        setProvider(provider);
        setYDoc(ydoc);

        // listen for websocket errors
        provider.on('connection-error', (error) => {
            console.error('WebSocket error:', error);
            setError('Error connecting to sketch.');
            provider.disconnect();
        });

        provider.on('status', async (event) => {
            if (event.status === 'connected') {
                const folderPath = await updateSketch(`collab_${roomID}`, '');

                setCurrentSketch({
                    fileName: `collab_${roomID}`,
                    content: '',
                    userName,
                    roomID,
                    isCollab: true,
                    isHost: false,
                });

                onSubmit();
                onCloseDialog();
            }
        });
    };

    return <Dialog.Root open={isOpen}>
        <Dialog.Trigger asChild onClick={onClick}>
            {trigger}
        </Dialog.Trigger>
        <Dialog.Content maxWidth="400px">
            <div>
                <Dialog.Title>
                    Join a sketch
                </Dialog.Title>

                <Dialog.Description size="1" mb="4" color="gray">
                    Join a collaborative sketch by entering the room ID and your name.
                </Dialog.Description>

                <Flex gap="3" direction="column">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Your name
                        </Text>
                        <TextField.Root placeholder="Enter your name" ref={userNameInput}>
                            <TextField.Slot>
                                <PersonIcon height="16" width="16"/>
                            </TextField.Slot>
                        </TextField.Root>
                    </label>

                    <label>
                        <Text as="div" size="2" mb="1" weight="bold">
                            Room ID
                        </Text>
                        <TextField.Root placeholder="Enter room ID" ref={sketchNameInput}>
                            <TextField.Slot>
                                <FileIcon height="16" width="16"/>
                            </TextField.Slot>
                        </TextField.Root>
                    </label>
                </Flex>

                {error && <Text size="1" color="red" mt="2">{error}</Text>}

                <Flex gap="3" mt="4" justify="center">
                    <Button radius="large" variant="soft" color="gray" onClick={onCloseDialog}>
                        Cancel
                    </Button>
                    <Dialog.Close>
                        <Button radius="large" onClick={joinSketch}>Join</Button>
                    </Dialog.Close>
                </Flex>
            </div>

        </Dialog.Content>
    </Dialog.Root>
};

export default JoinCollaborativeSketchDialog;

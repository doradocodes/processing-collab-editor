import React, {createRef, useState} from 'react';
import {FileIcon, PersonIcon} from '@radix-ui/react-icons';
import {Button, Dialog, Flex, Text, TextField} from "@radix-ui/themes";

const JoinCollaborativeSketchDialog = ({trigger, isOpen, onClick, onClose, isHost = false}) => {
    const [error, setError] = useState(null);

    const userNameInput = createRef();
    const sketchNameInput = createRef();

    const onCloseDialog = () => {
        setError(null);
        onClose();
    };

    const joinSketch = async () => {
        const userName = userNameInput.current.value;
        if (!userName) {
            setError('Please enter your name');
            return;
        }

        const roomID = sketchNameInput.current.value;
        if (!roomID) {
            setError('Please enter a room ID');
            return;
        }

        console.log('username:', userName)
        console.log('Joining sketch:', roomID);

        window.electronAPI.openNewWindow(`collab/${roomID}/user/${userName}`);

        onCloseDialog();
        onClose();
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
                        <TextField.Root placeholder="Enter room ID" ref={sketchNameInput} onSubmit={joinSketch}>
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
                    <Button radius="large" onClick={joinSketch}>Join</Button>

                </Flex>
            </div>

        </Dialog.Content>
    </Dialog.Root>
};

export default JoinCollaborativeSketchDialog;

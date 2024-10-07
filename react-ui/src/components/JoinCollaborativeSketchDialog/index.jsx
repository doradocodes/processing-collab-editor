import React, {createRef} from 'react';
import {Cross2Icon, FileIcon, PersonIcon} from '@radix-ui/react-icons';
import styles from './index.module.css';
import {Button, Flex, Text, TextField, Dialog} from "@radix-ui/themes";
import {getSketchFolders, updateSketch} from "../../utils/localStorageUtils.js";
import {useEditorStore} from "../../store/editorStore.js";

const JoinCollaborativeSketchDialog = ({ trigger, onClick, onSubmit }) => {
    const userNameInput = createRef();
    const sketchNameInput = createRef();

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const joinSketch = async (event) => {
        const fileName = sketchNameInput.current.value;
        if (!fileName) {
            return;
        }

        const userName = userNameInput.current.value;

        console.log('username:', userName)
        console.log('Joining sketch:', fileName);

        // create new local sketch -> mabye only after host disconnects?
        const folderPath = await updateSketch(`collab_${fileName}`, '');

        setCurrentSketch({
            fileName: `collab_${fileName}`,
            content: '',
            userName,
            isCollab: true,
            isHost: false,
        });

        onSubmit();
    };

    return <Dialog.Root>
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

                {/*{error && <Text size="1" className={styles.error}>{error}</Text>}*/}
                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={joinSketch}>Join</Button>
                    </Dialog.Close>
                </Flex>
            </div>

        </Dialog.Content>
    </Dialog.Root>
};

export default JoinCollaborativeSketchDialog;

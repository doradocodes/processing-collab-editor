import React, {createRef} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Cross2Icon, FileIcon, PersonIcon} from '@radix-ui/react-icons';
import styles from './index.module.css';
import {Button, Flex, Text, TextField} from "@radix-ui/themes";
import {getSketchFolders, updateSketch} from "../../utils/localStorage.js";
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
            fileName,
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
        <Dialog.Portal>
            <Dialog.Overlay className={styles.Overlay}/>
            <Dialog.Content
                className="radix-themes light"
                data-accent-color="indigo"
                data-gray-color="slate"
                data-has-background="true"
                data-panel-background="translucent"
                data-radius="medium"
                data-scaling="100%"
            >
                <div className={styles.Content}>
                    <Dialog.Title className={styles.Title}>
                        Join a sketch
                    </Dialog.Title>

                    <Flex gap="3" direction="column">
                        <TextField.Root placeholder="Enter your name" ref={userNameInput}>
                            <TextField.Slot>
                                <PersonIcon height="16" width="16"/>
                            </TextField.Slot>
                        </TextField.Root>
                        <TextField.Root placeholder="Enter sketch name" ref={sketchNameInput}>
                            <TextField.Slot>
                                <FileIcon height="16" width="16"/>
                            </TextField.Slot>
                        </TextField.Root>
                    </Flex>

                    {/*{error && <Text size="1" className={styles.error}>{error}</Text>}*/}
                    <div style={{display: 'flex', marginTop: 25, justifyContent: 'center'}}>
                        <Dialog.Close asChild>
                            <Button onClick={joinSketch}>Join sketch</Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className={styles.closeButton} aria-label="Close">
                            <Cross2Icon/>
                        </button>
                    </Dialog.Close>
                </div>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
};

export default JoinCollaborativeSketchDialog;

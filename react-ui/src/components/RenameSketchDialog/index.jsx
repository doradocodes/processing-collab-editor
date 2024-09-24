import React, {useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Cross2Icon, FileIcon, PersonIcon} from '@radix-ui/react-icons';
import styles from './index.module.css';
import {Button, Flex, Text, TextField} from "@radix-ui/themes";

const RenameSketchDialog = ({ trigger, onClick, defaultValue, isOpen = false, onClose}) => {
    const [name, setName] = useState(defaultValue);

    const onSave = () => {
        onClick(name);
    }

    return <Dialog.Root open={isOpen}>
        <Dialog.Trigger asChild>
            {trigger}
        </Dialog.Trigger>
        <Dialog.Portal>
            <Dialog.Overlay className={styles.Overlay} />
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
                        Rename sketch
                    </Dialog.Title>

                    <Flex gap="3" direction="column">
                        <TextField.Root
                            placeholder="Sketch name"
                            defaultValue={defaultValue}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        >
                        </TextField.Root>
                    </Flex>

                    {/*{error && <Text size="1" className={styles.error}>{error}</Text>}*/}
                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'center' }}>
                        <Dialog.Close asChild>
                            <Button onClick={onSave}>Save</Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Close asChild>
                        <button className={styles.closeButton} aria-label="Close" onClick={onClose}>
                            <Cross2Icon/>
                        </button>
                    </Dialog.Close>
                </div>

            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
};

export default RenameSketchDialog;

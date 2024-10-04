import React, {useState} from 'react';
import {Button, Dialog, Flex, TextField} from "@radix-ui/themes";

const RenameSketchDialog = ({onSave, defaultValue, isOpen = false, onClose}) => {
    const [name, setName] = useState(defaultValue);

    const onClick = () => {
        onSave(name);
        onClose();
    }

    return <Dialog.Root open={isOpen}>
        <Dialog.Content>
            <Dialog.Title>
                Rename sketch
            </Dialog.Title>

            <TextField.Root
                placeholder="Sketch name"
                defaultValue={defaultValue}
                value={name}
                onChange={(event) => setName(event.target.value)}
            >
            </TextField.Root>

            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close >
                    <Button onClick={onClick}>Save</Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
};

export default RenameSketchDialog;

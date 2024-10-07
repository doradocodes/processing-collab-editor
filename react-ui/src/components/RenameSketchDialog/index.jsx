import React, {useState} from 'react';
import {Button, Dialog, Flex, TextField, Text} from "@radix-ui/themes";
import {sanitizeFileNameForFs} from "../../utils/utils.js";

const RenameSketchDialog = ({onSave, isOpen = false, onClose}) => {
    const [name, setName] = useState("");

    const onClick = () => {
        const sanitizeName = sanitizeFileNameForFs(name);
        onSave(sanitizeName);
        onClose();
    }

    return <Dialog.Root open={isOpen}>
        <Dialog.Content align="center" maxWidth="400px">
            <Dialog.Title>
                Rename sketch
            </Dialog.Title>

            <Dialog.Description size="1" mb="4" color="gray">
                Enter a new name for the sketch. The name should not contain any special characters.
            </Dialog.Description>

            <label>
                <Text as="div" size="2" mb="1" weight="bold">
                    Sketch name
                </Text>
                <TextField.Root
                    placeholder="Enter sketch name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                >
                </TextField.Root>
            </label>

            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button onClick={onClick}>Save</Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    </Dialog.Root>
};

export default RenameSketchDialog;

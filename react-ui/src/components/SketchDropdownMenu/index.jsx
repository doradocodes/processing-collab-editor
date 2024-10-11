import React, {useState} from 'react';
import {
    Share1Icon,
} from '@radix-ui/react-icons';
import {ChevronDownIcon, DropdownMenu, IconButton} from "@radix-ui/themes";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorageUtils.js";
import {useEditorStore} from "../../store/editorStore.js";
import RenameSketchDialog from "../RenameSketchDialog/index.jsx";
import {generateroomID} from "../../utils/utils.js";

const SketchDropdownMenu = ({ trigger, onRename }) => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const onSave = async () => {
        const fileName = currentSketch.fileName || `sketch_${new Date().getTime()}`;
        if (!currentSketch.fileName) {
            await setCurrentSketch({
                ...currentSketch,
                fileName,
            });
        }
        await updateSketch(fileName, currentSketch.content || '');
    }

    const onCollabToggle = () => {
        setCurrentSketch({
            fileName: currentSketch.fileName,
            content: currentSketch.content,
            isCollab: true,
            isHost: true,
            roomID: generateroomID(),
        });
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" size="2" aria-label="Menu">
                    <ChevronDownIcon/>
                </IconButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={onSave}
                    shortcut="⌘ S / Ctrl-S"
                >
                    Save
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={(e) => {
                        onRename()
                    }}
                    // shortcut="⌘ R / Ctrl-R"
                >
                    Rename
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                    onClick={onCollabToggle}
                >
                    Collaborate
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default SketchDropdownMenu;

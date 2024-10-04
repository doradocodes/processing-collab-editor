import React, {useState} from 'react';
import {
    Share1Icon,
} from '@radix-ui/react-icons';
import {ChevronDownIcon, DropdownMenu, IconButton} from "@radix-ui/themes";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorage.js";
import {useEditorStore} from "../../store/editorStore.js";
import RenameSketchDialog from "../RenameSketchDialog/index.jsx";

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
        console.log('saved sketch:', currentSketch);
    }

    const onCollabToggle = () => {
        setCurrentSketch({
            fileName: currentSketch.fileName,
            content: currentSketch.content,
            isCollab: true,
            isHost: true,
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
                <DropdownMenu.Item onClick={onSave} shortcut="⌘ S">
                    Save
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={(e) => {
                        console.log('Rename clicked', e)
                        onRename()
                    }}
                >
                    Rename
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                    onClick={onCollabToggle}
                >
                    Collaborate
                </DropdownMenu.Item>

                {/*<DropdownMenu.CheckboxItem*/}
                {/*    className={styles.CheckboxItem}*/}
                {/*    checked={true}*/}
                {/*    onClick={onCollabToggle}*/}
                {/*>*/}
                {/*    <DropdownMenu.ItemIndicator>*/}
                {/*        <Share1Icon />*/}
                {/*    </DropdownMenu.ItemIndicator>*/}
                {/*    Collaborate*/}
                {/*</DropdownMenu.CheckboxItem>*/}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default SketchDropdownMenu;

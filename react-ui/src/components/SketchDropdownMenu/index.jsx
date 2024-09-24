import React, {useState} from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    Share1Icon,
} from '@radix-ui/react-icons';
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
            <DropdownMenu.Trigger asChild>
                {trigger}
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal
                className="radix-themes light"
                data-accent-color="indigo"
                data-gray-color="slate"
                data-has-background="true"
                data-panel-background="translucent"
                data-radius="medium"
                data-scaling="100%"
            >
                <DropdownMenu.Content className={styles.Content} sideOffset={1}>
                    <DropdownMenu.Item className={styles.Item} onClick={onSave}>
                        Save <div className={styles.RightSlot}>⌘+S</div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        className={styles.Item}
                        onClick={(e) => {
                            console.log('Rename clicked', e)
                            onRename()
                        }}
                    >
                        Rename
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className={styles.Separator} />

                    <DropdownMenu.CheckboxItem
                        className={styles.CheckboxItem}
                        checked={true}
                        onClick={onCollabToggle}
                    >
                        <DropdownMenu.ItemIndicator className={styles.ItemIndicator}>
                            <Share1Icon />
                        </DropdownMenu.ItemIndicator>
                        Collaborate
                    </DropdownMenu.CheckboxItem>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};

export default SketchDropdownMenu;

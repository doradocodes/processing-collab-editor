import React from 'react';
import {ChevronDownIcon, DropdownMenu, IconButton} from "@radix-ui/themes";
import {updateSketch} from "../../utils/localStorageUtils.js";
import {useEditorStore} from "../../store/editorStore.js";
import {generateroomID} from "../../utils/utils.js";
import {useWebsocketStore} from "../../store/websocketStore.js";

const SketchDropdownMenu = ({onRename, hasCollab}) => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const setupProvider = useWebsocketStore(state => state.setupProvider);

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

    const onCollabToggle = async () => {
        const roomID = generateroomID();
        await updateSketch(currentSketch.fileName, currentSketch.content);
        window.electronAPI.openNewWindow(`collab/${roomID}/user/Host/sketch/${currentSketch.fileName}`);
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

                <DropdownMenu.Separator/>

                {hasCollab &&
                    <DropdownMenu.Item
                        onClick={onCollabToggle}
                    >
                        Collaborate
                    </DropdownMenu.Item>
                }
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default SketchDropdownMenu;

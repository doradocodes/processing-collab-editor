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
import * as Y from "yjs";
import {WebsocketProvider} from "y-websocket";
import {useWebsocketStore, websocketServer} from "../../store/websocketStore.js";

const SketchDropdownMenu = ({ trigger, onRename }) => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const setProvider = useWebsocketStore(state => state.setProvider);
    const setYDoc = useWebsocketStore(state => state.setYDoc);

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
        const roomID = generateroomID();
        const ydoc = new Y.Doc();
        let provider = new WebsocketProvider(websocketServer, roomID  + "/host", ydoc);
        setProvider(provider);
        setYDoc(ydoc);

        setCurrentSketch({
            fileName: currentSketch.fileName,
            content: currentSketch.content,
            isCollab: true,
            isHost: true,
            roomID,
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

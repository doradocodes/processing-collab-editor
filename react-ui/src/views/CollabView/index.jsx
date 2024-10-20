import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Button, Flex, Heading, IconButton, Text, Theme, Tooltip } from "@radix-ui/themes";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

import { useEditorStore } from "../../store/editorStore.js";
import { useSketchesStore } from "../../store/sketchesStore.js";
import { useWebsocketStore } from "../../store/websocketStore.js";

import { getSketchFile, renameSketch, updateSketch } from "../../utils/localStorageUtils.js";
import { formatSketchName } from "../../utils/utils.js";

import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import DraggableElement from "../../components/DraggableIndicator/index.jsx";
import Console from "../../components/Console/index.jsx";
import DisconnectAlertDialog from "../../components/DisconnectAlertDialog/index.jsx";
import UserList from "../../components/UserList/index.jsx";
import CollabEditor from "../../components/CollabEditor/index.jsx";

import styles from './../../App.module.css';

/**
 * CollabView Component
 * 
 * This component represents the collaborative view of the application.
 * It handles the main layout, collaborative editing, and various user interactions.
 * 
 * @returns {JSX.Element} The rendered CollabView component
 */
function CollabView() {
    // Extract route parameters
    const { theme, roomID, userName, sketchFolder } = useParams();

    // State from stores
    const { currentSketch, setCurrentSketch } = useEditorStore(state => ({
        currentSketch: state.currentSketch,
        setCurrentSketch: state.setCurrentSketch
    }));
    const updateFilesFromLocalStorage = useSketchesStore(state => state.updateFilesFromLocalStorage);
    const { isDisconnectDialogOpen, setupProvider, provider, yDoc, isDocLoading } = useWebsocketStore(state => ({
        isDisconnectDialogOpen: state.isDisconnectDialogOpen,
        setupProvider: state.setupProvider,
        provider: state.provider,
        yDoc: state.yDoc,
        isDocLoading: state.isDocLoading
    }));

    // Local state
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [consoleHeight, setConsoleHeight] = useState(100);

    // Refs
    const currentSketchRef = useRef(currentSketch);

    // Effects
    useEffect(() => {
        currentSketchRef.current = currentSketch;
    }, [currentSketch]);

    useEffect(() => {
        if (sketchFolder) {
            initializeWithSketchFolder();
        } else if (roomID) {
            initializeWithRoomID();
        }
    }, []);

    // Helper functions
    const initializeWithSketchFolder = async () => {
        const content = await getSketchFile(sketchFolder);
        const sketch = {
            ...currentSketch,
            fileName: sketchFolder,
            content,
        };
        setCurrentSketch(sketch);
        setupProvider(roomID, true, sketch, userName);
    };

    const initializeWithRoomID = async () => {
        await updateSketch(`collab_${roomID}`, '');
        setCurrentSketch({
            fileName: `collab_${roomID}`,
            content: '',
        });
        setupProvider(roomID, false, null, userName);
    };

    const onOpenRenameDialog = () => setIsRenameDialogOpen(true);

    const onRename = async (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        await renameSketch(currentSketch.fileName, newName);
        await updateFilesFromLocalStorage();
    };

    const toggleLeftPanel = () => setIsLeftPanelOpen(!isLeftPanelOpen);

    const copyIDToClipboard = () => navigator.clipboard.writeText(roomID);

    const handleEditorChange = (content) => {
        setCurrentSketch({
            ...currentSketch,
            content
        });
    };

    const handleEditorSave = () => {
        updateSketch(currentSketchRef.current.fileName, currentSketchRef.current.content);
        setHasSaved(true);
        setTimeout(() => setHasSaved(false), 2000);
    };

    // Render
    return (
        <Theme
            appearance={theme}
            accentColor="indigo"
            panelBackground="translucent"
            radius="medium"
        >
            <div className='App'>
                <div className={styles.grid} data-panel-open={isLeftPanelOpen}>
                    <div className={styles.leftColumnHeader}>
                        <IconButton onClick={toggleLeftPanel} variant="ghost" mb="1">
                            <ViewVerticalIcon/>
                        </IconButton>
                    </div>

                    <div className={styles.rightColumnHeader}>
                        <Flex gap="3" align="center">
                            {!isLeftPanelOpen &&
                                <IconButton onClick={toggleLeftPanel} variant="ghost">
                                    <ViewVerticalIcon/>
                                </IconButton>
                            }

                            <Heading
                                size="4"
                                truncate={true}
                                verticalAlign="text-top"
                                className={styles.sketchName}
                            >
                                {formatSketchName(currentSketch?.fileName)}
                            </Heading>

                            <SketchDropdownMenu
                                onRename={onOpenRenameDialog}
                                hasCollab={false}
                            />

                            <RenameSketchDialog
                                defaultValue={currentSketch.fileName}
                                isOpen={isRenameDialogOpen}
                                onSave={onRename}
                                onClose={() => setIsRenameDialogOpen(false)}
                            />

                            {hasSaved && <span>Saved!</span>}
                        </Flex>
                        <PlayButton/>
                    </div>

                    <div className={styles.leftColumn}>
                        <img className={styles.logo} src="./Processing-logo.png" alt="logo"/>

                        <Flex align="start" direction="column" gap="1" mb="2">
                            <Text size="1" className={styles.subheader}>Room ID</Text>

                            {roomID &&
                                <Tooltip content="Copy ID">
                                    <Button
                                        color="green"
                                        size="1"
                                        onClick={copyIDToClipboard}
                                    >
                                        {roomID}
                                    </Button>
                                </Tooltip>
                            }
                        </Flex>

                        <hr/>
                        <UserList/>
                    </div>

                    <div className={styles.rightColumn}>
                        {yDoc && <CollabEditor
                            theme={theme}
                            sketchContent={currentSketch.content}
                            yDoc={yDoc}
                            provider={provider}
                            isDocLoading={isDocLoading}
                            onChange={handleEditorChange}
                            onSave={handleEditorSave}
                        />}
                        <div className={styles.layoutResize}>
                            <DraggableElement
                                onDrag={(height) => {
                                    setConsoleHeight(height);
                                }}
                            />
                        </div>
                        {<Console theme="dark" height={consoleHeight}/>}
                    </div>
                </div>

                {isDisconnectDialogOpen && <DisconnectAlertDialog isOpen={true}/>}
            </div>
        </Theme>
    );
}

export default CollabView;

import {useEditorStore} from "../../store/editorStore.js";
import {useSketchesStore} from "../../store/sketchesStore.js";
import {useWebsocketStore} from "../../store/websocketStore.js";
import React, {useEffect, useRef, useState} from "react";
import {getSketchFile, renameSketch, updateSketch} from "../../utils/localStorageUtils.js";
import {Badge, Button, Flex, Heading, IconButton, Text, Theme, Tooltip} from "@radix-ui/themes";
import {ViewVerticalIcon} from "@radix-ui/react-icons";
import {formatSketchName} from "../../utils/utils.js";
import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import DraggableElement from "../../components/DraggableIndicator/index.jsx";
import Console from "../../components/Console/index.jsx";
import DisconnectAlertDialog from "../../components/DisconnectAlertDialog/index.jsx";
import UserList from "../../components/UserList/index.jsx";
import {useParams} from "react-router-dom";
import CollabEditor from "../../components/CollabEditor/index.jsx";
import styles from './../../App.module.css';

// eslint-disable-next-line react/prop-types
function CollabView() {
    const { theme, roomID, userName, sketchFolder} = useParams();

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const updateFilesFromLocalStorage = useSketchesStore(state => state.updateFilesFromLocalStorage)
    const isDisconnectDialogOpen = useWebsocketStore(state => state.isDisconnectDialogOpen)

    const setupProvider = useWebsocketStore(state => state.setupProvider);
    const provider = useWebsocketStore(state => state.provider);
    const yDoc = useWebsocketStore(state => state.yDoc);
    const isDocLoading = useWebsocketStore(state => state.isDocLoading);

    const currentSketchRef = useRef(currentSketch); // Create a ref

    useEffect(() => {
        currentSketchRef.current = currentSketch;
    }, [currentSketch]);

    useEffect(() => {
        if (sketchFolder) {
            getSketchFile(sketchFolder)
                .then(content => {
                    const sketch = {
                        ...currentSketch,
                        fileName: sketchFolder,
                        content,
                    };
                    setCurrentSketch(sketch);
                    setupProvider(roomID, true, sketch, userName);
                });
        } else if (roomID) {
            updateSketch(`collab_${roomID}`, '')
                .then(() => {
                    setCurrentSketch({
                        fileName: `collab_${roomID}`,
                        content: '',
                    });

                    setupProvider(roomID, false, null, userName);
                });
        }
    }, []);

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [consoleHeight, setConsoleHeight] = useState(100);

    const onOpenRenameDialog = () => {
        setIsRenameDialogOpen(true);
    }

    const onRename = async (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        await renameSketch(currentSketch.fileName, newName);
        await updateFilesFromLocalStorage();
    }

    const toggleLeftPanel = () => {
        setIsLeftPanelOpen(!isLeftPanelOpen);
    }

    const copyIDToClipboard = () => {
        navigator.clipboard.writeText(roomID);
    }

    return <Theme
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
                        onChange={(content) => {
                            setCurrentSketch({
                                ...currentSketch,
                                content
                            });
                        }}
                        onSave={() => {
                            updateSketch(currentSketchRef.current.fileName, currentSketchRef.current.content);
                            setHasSaved(true);
                            setTimeout(() => {
                                setHasSaved(false);
                            }, 2000);
                        }}
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
}

export default CollabView;

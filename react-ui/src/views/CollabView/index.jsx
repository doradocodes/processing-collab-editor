import {useEditorStore} from "../../store/editorStore.js";
import {useSketchesStore} from "../../store/sketchesStore.js";
import {useWebsocketStore} from "../../store/websocketStore.js";
import React, {useEffect, useRef, useState} from "react";
import {getSketchFile, renameSketch, updateSketch} from "../../utils/localStorageUtils.js";
import styles from "./index.module.css";
import {Badge, Text, Flex, Heading, IconButton, Tooltip} from "@radix-ui/themes";
import {ViewVerticalIcon} from "@radix-ui/react-icons";
import {formatSketchName} from "../../utils/utils.js";
import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import Editor from "../../components/Editor/index.jsx";
import DraggableElement from "../../components/DraggableIndicator/index.jsx";
import Console from "../../components/Console/index.jsx";
import DisconnectAlertDialog from "../../components/DisconnectAlertDialog/index.jsx";
import UserList from "../../components/UserList/index.jsx";
import {useParams} from "react-router-dom";
import CollabEditor from "../../components/CollabEditor/index.jsx";

// eslint-disable-next-line react/prop-types
function CollabView({theme}) {
    const params = useParams();
    const roomID = params.roomID;
    const userName = params.userName;
    const sketchFolder = params.sketchFolder;

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const updateFilesFromLocalStorage = useSketchesStore(state => state.updateFilesFromLocalStorage)
    const isDisconnectDialogOpen = useWebsocketStore(state => state.isDisconnectDialogOpen)

    const setupProvider = useWebsocketStore(state => state.setupProvider);
    const provider = useWebsocketStore(state => state.provider);
    const yDoc = useWebsocketStore(state => state.yDoc);
    const isDocLoading = useWebsocketStore(state => state.isDocLoading);

    // console.log('ydoc', yDoc);
    // console.log('provider', provider);

    const currentSketchRef = useRef(currentSketch); // Create a ref

    useEffect(() => {
        currentSketchRef.current = currentSketch; // Update the ref whenever currentSketch changes
    }, [currentSketch]); // Ensure it runs on currentSketch updates

    useEffect(() => {
        if (sketchFolder) {
            getSketchFile(sketchFolder)
                .then(content => {
                    const sketch = {
                        ...currentSketch,
                        fileName: sketchFolder,
                        content,
                        roomID,
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
                        userName,
                        roomID,
                        // isCollab: true,
                        // isHost: false,
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

    const onRename = (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        renameSketch(currentSketch.fileName, newName);
        updateFilesFromLocalStorage();
    }

    const toggleLeftPanel = () => {
        setIsLeftPanelOpen(!isLeftPanelOpen);
    }

    const copyIDToClipboard = () => {
        navigator.clipboard.writeText(currentSketch.roomID);
    }

    return <div className='App'>
        <div className={styles.grid} data-panel-open={isLeftPanelOpen}>
            <div className={styles.leftColumnHeader}>
                {isLeftPanelOpen &&
                    [
                        <IconButton onClick={toggleLeftPanel} variant="ghost" mb="1">
                            <ViewVerticalIcon/>
                        </IconButton>,
                        <img className="logo" src="./Processing-logo.png" alt="logo"/>,
                        <div></div>
                    ]
                }
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

                    {currentSketch.roomID &&
                        <Tooltip content="Copy ID" size="1">
                            <Badge color="green"
                                   onClick={copyIDToClipboard}
                            >Room ID: {currentSketch.roomID}</Badge>
                        </Tooltip>
                    }

                    {hasSaved && <span>Saved!</span>}

                </Flex>
                <PlayButton/>
            </div>

            <div className={styles.leftColumn}>
                <UserList />
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
}

export default CollabView;

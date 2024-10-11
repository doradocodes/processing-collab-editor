import {useEditorStore} from "../../store/editorStore.js";
import React, {useEffect, useRef, useState} from "react";
import {renameSketch, updateSketch} from "../../utils/localStorageUtils.js";
import {Button, Flex, Heading, IconButton, Text, Tooltip} from "@radix-ui/themes";
import {MoonIcon, Share1Icon, ViewVerticalIcon} from "@radix-ui/react-icons";
import styles from "../../App.module.css";
import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import Sketches from "../../components/Sketches/index.jsx";
import Editor from "../../components/Editor/index.jsx";
import Console from "../../components/Console/index.jsx";
import {formatSketchName} from "../../utils/utils.js";

function Main({ theme }) {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const currentSketchRef = useRef(currentSketch); // Create a ref

    useEffect(() => {
        currentSketchRef.current = currentSketch; // Update the ref whenever currentSketch changes
    }, [currentSketch]); // Ensure it runs on currentSketch updates



    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);


    // Listen for the theme message from the main process
    // useEffect(() => {
    //     ipcRenderer.on('set-theme', (event, theme) => {
    //         setIsDarkMode(theme === 'dark');
    //     });
    //
    //     return () => {
    //         ipcRenderer.removeAllListeners('set-theme');
    //     };
    // }, []);

    // const toggleTheme = () => {
    //     setIsDarkMode(!isDarkMode);
    //     // store.set('theme', isDarkMode ? 'dark' : 'light');
    // }

    const onOpenRenameDialog = () => {
        setIsRenameDialogOpen(true);
    }

    const onRename = (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        renameSketch(currentSketch.fileName, newName);
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
                        <IconButton onClick={toggleLeftPanel} variant="ghost">
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

                    <Heading as="h5" truncate={true} className={styles.sketchName}>{formatSketchName(currentSketch?.fileName)}</Heading>

                    <SketchDropdownMenu
                        onRename={onOpenRenameDialog}
                    />

                    <RenameSketchDialog
                        defaultValue={currentSketch.fileName}
                        isOpen={isRenameDialogOpen}
                        onSave={onRename}
                        onClose={() => setIsRenameDialogOpen(false)}
                    />

                    {currentSketch.isCollab && currentSketch.roomID &&
                        <Tooltip content="Copy ID" size="1">
                            <Button
                                variant="soft" size="1" color="green"
                                onClick={copyIDToClipboard}
                            >Room ID: {currentSketch.roomID}</Button>
                        </Tooltip>
                    }

                    {hasSaved && <span>Saved!</span>}
                </Flex>
                <PlayButton/>
            </div>

            <div className={styles.leftColumn}>
                <Sketches/>
            </div>


            <div className={styles.rightColumn}>
                <Editor
                    theme={theme}
                    sketchName={currentSketch.fileName}
                    sketchContent={currentSketch.content}
                    roomID={currentSketch.roomID}
                    isCollab={currentSketch.isCollab}
                    isHost={currentSketch.isHost}
                    userName={currentSketch.userName}
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
                />

                <Console theme={theme}/>
            </div>
        </div>
    </div>
}

export default Main;

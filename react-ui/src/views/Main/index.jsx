import {useEditorStore} from "../../store/editorStore.js";
import React, {useEffect, useRef, useState} from "react";
import {renameSketch, updateSketch} from "../../utils/localStorage.js";
import {Flex, Heading, IconButton} from "@radix-ui/themes";
import {MoonIcon, Share1Icon, ViewVerticalIcon} from "@radix-ui/react-icons";
import styles from "../../App.module.css";
import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import Sketches from "../../components/Sketches/index.jsx";
import Editor from "../../components/Editor/index.jsx";
import Console from "../../components/Console/index.jsx";

function Main({ isDarkMode, setIsDarkMode }) {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const currentSketchRef = useRef(currentSketch); // Create a ref

    useEffect(() => {
        currentSketchRef.current = currentSketch; // Update the ref whenever currentSketch changes
    }, [currentSketch]); // Ensure it runs on currentSketch updates



    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);


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

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // store.set('theme', isDarkMode ? 'dark' : 'light');
    }

    const onOpenRenameDialog = () => {
        setIsRenameDialogOpen(true);
    }

    const onRename = (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        console.log("Rename", newName)
        renameSketch(currentSketch.fileName, newName);
    }

    const toggleLeftPanel = () => {
        setIsLeftPanelOpen(!isLeftPanelOpen);
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
                        <IconButton onClick={toggleTheme} variant="ghost">
                            <MoonIcon/>
                        </IconButton>
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

                    <Heading as="h5">{currentSketch?.fileName || '[Untitled]'}</Heading>

                    <SketchDropdownMenu
                        onRename={onOpenRenameDialog}
                    />

                    <RenameSketchDialog
                        defaultValue={currentSketch.fileName}
                        isOpen={isRenameDialogOpen}
                        onSave={onRename}
                        onClose={() => setIsRenameDialogOpen(false)}
                    />

                    {currentSketch.isCollab && <Share1Icon color={'green'}/>}

                    {hasSaved && <span>Saved!</span>}
                </Flex>
                <PlayButton/>
            </div>

            <div className={styles.leftColumn}>
                <Sketches/>
            </div>


            <div className={styles.rightColumn}>
                <Editor
                    isDarkTheme={isDarkMode}
                    sketchName={currentSketch.fileName}
                    sketchContent={currentSketch.content}
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
                        console.log('Saving sketch:', currentSketchRef.current);
                        updateSketch(currentSketchRef.current.fileName, currentSketchRef.current.content);
                        setHasSaved(true);
                        setTimeout(() => {
                            setHasSaved(false);
                        }, 2000);
                    }}
                />
                <Console isDarkTheme={isDarkMode}/>
            </div>
        </div>
    </div>
}

export default Main;

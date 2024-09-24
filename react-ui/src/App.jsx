import './App.css';
import styles from './App.module.css';
import React, {useEffect, useRef, useState} from "react";
import PlayButton from "./components/PlayButton/index.jsx";
import Sketches from "./components/Sketches/index.jsx";
import Editor from "./components/Editor/index.jsx";
import Console from "./components/Console/index.jsx";
import {useEditorStore} from "./store/editorStore.js";
import {getSketchFolders, renameSketch, updateSketch} from "./utils/localStorage.js";
import {Button, ChevronDownIcon, Flex, Heading, Theme} from "@radix-ui/themes";
import {CheckIcon, FileIcon, MoonIcon, Pencil1Icon, Share1Icon} from "@radix-ui/react-icons";
import JoinCollaborativeSketchDialog from "./components/JoinCollaborativeSketchDialog/index.jsx";
import SketchDropdownMenu from "./components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "./components/RenameSketchDialog/index.jsx";

// const { ipcRenderer } = window.require('electron');
// const Store = window.require('electron-store');
// const store = new Store();

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const currentSketchRef = useRef(currentSketch); // Create a ref

    useEffect(() => {
        currentSketchRef.current = currentSketch; // Update the ref whenever currentSketch changes
    }, [currentSketch]); // Ensure it runs on currentSketch updates


    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);


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
        setIsRenameDialogOpen(false);

    }

    return <Theme
        appearance={isDarkMode ? 'dark' : 'light'}
        accentColor="indigo"
        panelBackground="translucent"
        radius="medium"
    >
        <div className='App'>
            <div className="grid">
                <Flex justify="center" align="center">
                    <img className="logo" src="./Processing-logo.png" alt="logo"/>
                    <MoonIcon className={styles.darkThemeButton} onClick={toggleTheme}/>
                </Flex>

                <Flex justify="between" align="center">
                    <Flex gap="3" align="center">
                        <Heading as="h2">{currentSketch?.fileName || '[Untitled]'}</Heading>

                        <SketchDropdownMenu
                            trigger={<ChevronDownIcon />}
                            onRename={onOpenRenameDialog}
                        />

                        <RenameSketchDialog
                            defaultValue={currentSketch.fileName}
                            isOpen={isRenameDialogOpen}
                            onClick={onRename}
                            onClose={() => setIsRenameDialogOpen(false)}
                        />

                        {currentSketch.isCollab && <Share1Icon color={'green'}/>}

                        {hasSaved && <span>Saved!</span>}
                    </Flex>
                    <PlayButton/>
                </Flex>

                <Sketches/>

                <div>
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
                    <Console isDarkTheme={isDarkMode} />
                </div>
            </div>
        </div>
    </Theme>
}

export default App

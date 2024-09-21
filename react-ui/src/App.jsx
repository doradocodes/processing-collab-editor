import './App.css';
import styles from './App.module.css';
import React, {useEffect, useState} from "react";
import PlayButton from "./components/PlayButton/index.jsx";
import Sketches from "./components/Sketches/index.jsx";
import Editor from "./components/Editor/index.jsx";
import Console from "./components/Console/index.jsx";
import {useEditorStore} from "./store/editorStore.js";
import {updateSketch} from "./utils/localStorage.js";
import {Button, Flex, Heading, Theme} from "@radix-ui/themes";
import {CheckIcon, FileIcon, MoonIcon, Share1Icon} from "@radix-ui/react-icons";

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeSketch, setActiveSketch] = useState(currentSketch);
    const [isSaving, setIsSaving] = useState(false);
    const [isCollab, setIsCollab] = useState(false);

    const onCollabToggle = () => {
        setIsCollab(true);
        setCurrentSketch({
            ...currentSketch,
            ...activeSketch,
            isCollab: true,
            isHost: true,
        });
    };

    useEffect(() => {
        if (currentSketch) {
            setActiveSketch(currentSketch);
        }
    }, [currentSketch]);

    const onSave = async () => {
        setIsSaving(true);
        const fileName = currentSketch.fileName || `sketch_${new Date().getTime()}`;
        if (!currentSketch.fileName) {
            await setCurrentSketch({
                ...currentSketch,
                fileName,
            });
        }
        await updateSketch(fileName, currentSketch.content || '');
        console.log('saved sketch:', currentSketch);

        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
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
                    <MoonIcon className={styles.darkThemeButton} onClick={() => setIsDarkMode(!isDarkMode)}/>
                </Flex>

                <Flex justify="between" align="center">
                    <Flex gap="3" align="center">
                        <Heading as="h2">{activeSketch?.fileName || '[Untitled]'}</Heading>
                        {isSaving ? <CheckIcon /> : <FileIcon onClick={onSave}/>}
                        {isCollab ?
                            <span className="label">Collaborating</span>
                            :
                            activeSketch && <Share1Icon onClick={onCollabToggle}/>
                        }
                    </Flex>
                    <PlayButton/>
                </Flex>

                <Sketches/>

                <div>
                    <Editor
                        isDarkTheme={isDarkMode}
                        sketchName={activeSketch.fileName}
                        sketchContent={activeSketch.content}
                        isCollab={activeSketch.isCollab}
                        isHost={activeSketch.isHost}
                        onChange={(content) => {
                            setCurrentSketch({
                                ...activeSketch,
                                content
                            });
                        }}
                    />
                    <Console isDarkTheme={isDarkMode} />
                </div>
            </div>
        </div>
    </Theme>
}

export default App

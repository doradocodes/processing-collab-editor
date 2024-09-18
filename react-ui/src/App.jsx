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
import {MoonIcon} from "@radix-ui/react-icons";

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeSketch, setActiveSketch] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCollab, setIsCollab] = useState(false);

    const onCollabToggle = () => {
        setIsCollab(true);
        setCurrentSketch({
            ...currentSketch,
            isCollab: true,
        });
    };

    useEffect(() => {
        if (currentSketch.fileName) {
            setActiveSketch(currentSketch.fileName);
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
                    <Flex gap="2">
                        <Heading as="h2">{activeSketch || '[Untitled]'}</Heading>
                        {isSaving ? <span className="label">Saved!</span> : <Button onClick={onSave}>Save</Button>}
                        {isCollab ?
                            <span className="label">Collaborating</span>
                            :
                            activeSketch && <Button onClick={onCollabToggle}>Collab</Button>
                        }
                    </Flex>
                    <PlayButton/>
                </Flex>

                <Flex>
                    <Sketches/>
                </Flex>

                <Flex direction="column" justify="between" gap="3">
                    <Editor isDarkTheme={isDarkMode}/>
                    <Console />
                </Flex>

            </div>
        </div>
    </Theme>
}

export default App

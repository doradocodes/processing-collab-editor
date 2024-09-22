import './App.css';
import styles from './App.module.css';
import React, {useEffect, useState} from "react";
import PlayButton from "./components/PlayButton/index.jsx";
import Sketches from "./components/Sketches/index.jsx";
import Editor from "./components/Editor/index.jsx";
import Console from "./components/Console/index.jsx";
import {useEditorStore} from "./store/editorStore.js";
import {updateSketch} from "./utils/localStorage.js";
import {Button, ChevronDownIcon, Flex, Heading, Theme} from "@radix-ui/themes";
import {CheckIcon, FileIcon, MoonIcon, Pencil1Icon, Share1Icon} from "@radix-ui/react-icons";
import JoinCollaborativeSketchDialog from "./components/JoinCollaborativeSketchDialog/index.jsx";
import SketchDropdownMenu from "./components/SketchDropdownMenu/index.jsx";

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const [isDarkMode, setIsDarkMode] = useState(false);


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
                        <Heading as="h2">{currentSketch?.fileName || '[Untitled]'}</Heading>

                        <SketchDropdownMenu trigger={<ChevronDownIcon />}/>

                        {currentSketch.isCollab && <Share1Icon color={'green'}/>}
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
                    />
                    <Console isDarkTheme={isDarkMode} />
                </div>
            </div>
        </div>
    </Theme>
}

export default App

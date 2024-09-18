import './App.css'
import React, {useEffect, useState} from "react";
import PlayButton from "./components/PlayButton/index.jsx";
import Sketches from "./components/Sketches/index.jsx";
import Editor from "./components/Editor/index.jsx";
import Console from "./components/Console/index.jsx";
import {useEditorStore} from "./store/editorStore.js";
import {updateSketch} from "./utils/localStorage.js";

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

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

    return <div className='App'>
        <div className="grid">
            <div className="column">
                <div className="header">
                    <img className="logo" src="./Processing-logo.png" alt="logo"/>
                </div>
                <Sketches/>
            </div>


            <div className="column">
                <div className="header space-between">
                    <div className="header">
                        <h2 className="label">{activeSketch || '[Untitled]'}</h2>
                        {isSaving ? <span className="label">Saved!</span> : <button onClick={onSave}>Save</button>}
                        {/*<button>Rename</button>*/}
                        {isCollab ?
                            <span className="label">Collaborating</span>
                            :
                            activeSketch && <button onClick={onCollabToggle}>Collab</button>
                        }
                    </div>

                    <PlayButton/>
                </div>
                <Editor />
                {/*<div>*/}
                {/*    <div className={styles.draggableIndicator} />*/}
                {/*</div>*/}
                <Console />
            </div>

        </div>
    </div>;
}

export default App

import './App.css'
import React, {useEffect} from "react";
import PlayButton from "./components/PlayButton/index.jsx";
import Sketches from "./components/Sketches/index.jsx";
import Editor from "./components/Editor/index.jsx";
import Console from "./components/Console/index.jsx";
import {useEditorStore} from "./store/editorStore.js";
import {updateSketch} from "./utils/localStorage.js";

function App() {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const editorContent = useEditorStore(state => state.editorContent);

    const onSave = () => {
        console.log('Save');
        updateSketch(currentSketch, editorContent);
    }

    return <div className='App'>
        <div className="grid">
            <div className="column">
                <div className="header">
                    <img className="logo" src="/Processing-logo.png" alt="logo"/>
                </div>
                <Sketches/>
            </div>


            <div className="column">
                <div className="header space-between">
                    <div className="header">
                        <h2 className="current_sketch_label">{currentSketch}</h2>
                        <button onClick={onSave}>Save</button>
                        <button>Rename</button>
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

import './App.css'
import React from "react";
import ResizableLayout from "./components/ResizableLayout/index.jsx";
import {useEditorStore} from "./store/editorStore.js";

function App() {
    const editorContent = useEditorStore(state => state.editorContent);
    const runCode = () => {
        const content = editorContent;
        const fileName = `sketch_${new Date().getTime()}`;
        window.electronAPI.runProcessing(fileName, content);
    };

    return (
        <div className='App'>
            <div className="header">
                <img className="logo" src="/Processing-logo.png" alt="logo"/>
                <button onClick={runCode}>Play</button>
            </div>

            <ResizableLayout />
        </div>
    )
}

export default App

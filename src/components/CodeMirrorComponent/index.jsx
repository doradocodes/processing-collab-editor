import React, {useEffect} from 'react';

import {basicSetup, EditorView} from "codemirror"
import {java} from "@codemirror/lang-java"

let view;
const CodeMirrorComponent = () => {
    useEffect(() => {
        console.log('CodeMirrorComponent loaded');

        view = new EditorView({
            doc: "console.log('hello')\n",
            extensions: [basicSetup, java()],
            parent: document.body.querySelector('#editor')
        })
    }, []);

    const runCode = () => {
        const content = view.state.doc.toString();
        console.log(content);
        window.ipcRenderer.writeTempFile(content);
    };

    return <div className="editor-wrapper">
        <div id="editor"/>
        <button onClick={runCode}>Run</button>
    </div>
}

export default CodeMirrorComponent;

import React, {useEffect, useState} from 'react';

import {basicSetup, EditorView} from "codemirror"
import {java} from "@codemirror/lang-java";
import styles from './index.module.css';

let editor = null;

const CodeMirrorComponent = () => {
    const [output, setOutput] = useState('Console output will appear here...');

    useEffect(() => {
        console.log('CodeMirrorComponent loaded');

        editor = new EditorView({
            // doc: testSketch,
            contentHeight: 100,
            extensions: [basicSetup, java()],
            parent: document.body.querySelector('#editor')
        });

        window.electronAPI.onProcessingOutput((data) => {
            setOutput(data);
        });

    }, []);

    const runCode = () => {
        const content = editor.state.doc.toString();
        const fileName = `sketch_${new Date().getTime()}`;
        window.electronAPI.runProcessing(fileName, content);
    };

    return <div className={styles.wrapper}>
        <div id="editor" className={styles.editor}>
            <div className={styles.editorGutter}></div>
        </div>
        <div id="console" className={styles.console}>
            <div className={styles.output}>{output}</div>
        </div>
        <button className={styles.playButton} onClick={runCode}>Play</button>
    </div>
}

export default CodeMirrorComponent;

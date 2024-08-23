import React, {useEffect, useState} from 'react';

import {basicSetup, EditorView} from "codemirror"
import {java} from "@codemirror/lang-java";
import styles from './index.module.css';
import {useEditorStore} from "../../store/editorStore.js";

let editor = null;

const CodeMirrorComponent = () => {
    const [editorHeight, setEditorHeight] = useState('100%');
    const updateEditorContent = useEditorStore(state => state.updateContent);

    useEffect(() => {
        console.log('CodeMirrorComponent loaded');

        editor = new EditorView({
            // doc: testSketch,
            extensions: [
                basicSetup,
                java(),
                EditorView.updateListener.of(update => {
                    if (update.docChanged) {
                        // Content of the editor has changed
                        console.log("Editor content changed!");
                        // You can add your custom logic here
                        updateEditorContent(update.state.doc.toString());
                    }
                })
            ],
            parent: document.body.querySelector('#editor')

        });


        // const editorHeight = editor.dom.clientHeight;
        // setEditorHeight(editorHeight);
    }, []);

    return <div className={styles.wrapper}>
        <div id="editor" className={styles.editor} style={{ maxHeight: editorHeight }}>
            <div className={styles.editorGutter}></div>
        </div>
    </div>
}

export default CodeMirrorComponent;

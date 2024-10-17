import React, {useEffect, useRef} from 'react';
import * as Y from 'yjs'
import {yCollab} from 'y-codemirror.next'

import {basicSetup, EditorView} from "codemirror";
import {keymap} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {indentWithTab} from "@codemirror/commands";
import {java} from "@codemirror/lang-java";

import styles from './index.module.css';
import {materialDark, materialLight} from "@uiw/codemirror-theme-material";
import {useWebsocketStore} from "../../store/websocketStore.js";
import {Spinner} from "@radix-ui/themes";

const CollabEditor = ({sketchName, sketchContent, roomID, isHost, userName, theme, onChange, onSave}) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    const provider = useWebsocketStore(state => state.provider);
    const yDoc = useWebsocketStore(state => state.yDoc);
    const isDocLoading = useWebsocketStore(state => state.isDocLoading);
    const setIsConnected = useWebsocketStore(state => state.setIsConnected);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                onSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // call save every minute
        // const interval = setInterval(() => {
        //     onSave();
        // }, 60000);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            // clearInterval(interval);
        };
    }, []);

    const getExtensions = () => {
        const ytext = yDoc.getText('codemirror');
        const undoManager = new Y.UndoManager(ytext);
        const extensions = [
            basicSetup,
            theme === 'dark' ? materialDark : materialLight,
            EditorView.theme({
                ".cm-content": {
                    fontSize: "0.8em" // Set your desired font size here
                },
                ".cm-gutters": {
                    fontSize: "0.8em" // Set your desired font size here
                }
            }),
            keymap.of([indentWithTab]),
            java(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    onChange(content);
                }
            }),
            yCollab(ytext, provider.awareness, {undoManager})
        ];
        return extensions;
    }

    useEffect(() => {
        editorRef.current.innerHTML = '';

        const state = EditorState.create({
            doc: sketchContent,
            extensions: getExtensions(),
        })

        const view = new EditorView({
            state,
            parent: editorRef.current
        });
        viewRef.current = view;

        return () => {
            viewRef.current.destroy();
            // provider?.disconnect();
            provider?.destroy(); //TODO: runs when sketch is renamed
            // setIsConnected(false);
            console.log('Editor destroyed');
        };
    }, [sketchName, isCollab, theme]);

    return [
        <div className={styles.editor} ref={editorRef} data-is-loading={isDocLoading}/>,
        isDocLoading && <Spinner className={styles.spinner} size="20px" color="#1be7ff"/>
    ];
};

export default CollabEditor;


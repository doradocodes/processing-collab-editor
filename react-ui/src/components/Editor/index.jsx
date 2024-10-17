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

const userColors = [
    {color: '#30bced', light: '#30bced33'},
    {color: '#6eeb83', light: '#6eeb8333'},
    {color: '#ffbc42', light: '#ffbc4233'},
    {color: '#ecd444', light: '#ecd44433'},
    {color: '#ee6352', light: '#ee635233'},
    {color: '#9ac2c9', light: '#9ac2c933'},
    {color: '#8acb88', light: '#8acb8833'},
    {color: '#1be7ff', light: '#1be7ff33'}
];

const Editor = ({sketchName, sketchContent, isCollab, roomID, isHost, userName, theme, onChange, onSave}) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    const setProvider = useWebsocketStore(state => state.setProvider);
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
            })
        ];

        if (isCollab && roomID && yDoc) {
            const ytext = yDoc.getText('codemirror');
            const undoManager = new Y.UndoManager(ytext);

            extensions.push(yCollab(ytext, provider.awareness, {undoManager}));
        }

        return extensions;
    }

    const renderEditor = () => {
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
    }

    useEffect(() => {
        renderEditor();

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

export default Editor;


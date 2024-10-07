import React, {useEffect, useRef} from 'react';
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {indentWithTab} from "@codemirror/commands";

import * as random from 'lib0/random'
import {java} from "@codemirror/lang-java";

import styles from './index.module.css';
import {materialLight, materialDark} from "@uiw/codemirror-theme-material";
import {updateSketch} from "../../utils/localStorageUtils.js";

const userColors = [
    { color: '#30bced', light: '#30bced33' },
    { color: '#6eeb83', light: '#6eeb8333' },
    { color: '#ffbc42', light: '#ffbc4233' },
    { color: '#ecd444', light: '#ecd44433' },
    { color: '#ee6352', light: '#ee635233' },
    { color: '#9ac2c9', light: '#9ac2c933' },
    { color: '#8acb88', light: '#8acb8833' },
    { color: '#1be7ff', light: '#1be7ff33' }
]

const websocketServer = 'ws://pce-server.glitch.me/1234';
// const websocketServer = 'ws://localhost:1234';

let provider;

const Editor = ({ sketchName, sketchContent, isCollab, roomID, isHost, userName, isDarkTheme, onChange, onSave }) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                onSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // call save every minute
        const interval = setInterval(() => {
            onSave();
        }, 60000);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, []);

    const getExtensions = () => {
        const extensions = [
            basicSetup,
            isDarkTheme ? materialDark : materialLight,
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

        if (isCollab && roomID) {
            const ydoc = new Y.Doc()
            provider = new WebsocketProvider(websocketServer, roomID, ydoc);
            console.log('Connecting to', websocketServer, roomID);

            // Listen for messages (this is where you get the initial document state)
            provider.onmessage = (event) => {
                const data = event.data;

                if (data instanceof ArrayBuffer) {
                    // Decode the Yjs update sent from the server
                    const update = new Uint8Array(data);

                    // Apply the document update to the local Y.Doc
                    // applyUpdate(yDoc, update);
                    console.log('Applied document update:', update);
                } else {
                    console.error('Received unknown data format from WebSocket:', data);
                }
            };

            provider.on('status', event => {
                console.log('Connection status:', event.status);
            })

            const ytext = ydoc.getText('codemirror');

            if (isHost) {
                ytext.insert(0, sketchContent);
            }

            const undoManager = new Y.UndoManager(ytext);
            const userColor = userColors[random.uint32() % userColors.length];
            provider.awareness.setLocalStateField('user', {
                name: isHost ? 'Host' : userName || 'Guest' ,
                color: userColor.color,
                colorLight: userColor.light
            });
            extensions.push(yCollab(ytext, provider.awareness, {undoManager}));
        }

        return extensions;
    }

    const renderEditor = () => {
        editorRef.current.innerHTML = '';

        let provider = null;

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
            view.destroy();
            provider?.destroy();
        };
    }

    useEffect(() => {
        console.log('Editor mounted');
        renderEditor();
    }, [sketchName, isCollab, isDarkTheme]);

    return <div className={styles.editor} ref={editorRef}/>
};

export default Editor;


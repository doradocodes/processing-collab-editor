import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import * as random from 'lib0/random'
import {java} from "@codemirror/lang-java";

import styles from './index.module.css';
import {useEditorStore} from "../../store/editorStore.js";

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

const Editor = () => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);
    const editorContent = useEditorStore(state => state.editorContent);
    const updateContent = useEditorStore(state => state.updateContent);

    useEffect(() => {
        // select a random color for this user
        const userColor = userColors[random.uint32() % userColors.length]

        const ydoc = new Y.Doc()
        const provider = new WebsocketProvider('ws://pce-server.glitch.me/1234', 'codemirror6-demo-room', ydoc)
        // const provider = new WebrtcProvider('codemirror6-demo-room', ydoc)
        const ytext = ydoc.getText('codemirror')

        const undoManager = new Y.UndoManager(ytext)

        provider.awareness.setLocalStateField('user', {
            name: 'Anonymous ' + Math.floor(Math.random() * 100),
            color: userColor.color,
            colorLight: userColor.light
        })

        const theme = EditorView.theme({
            "&": {
                backgroundColor: "white"
            }
        })

        const state = EditorState.create({
            doc: editorContent,
            extensions: [
                basicSetup,
                theme,
                java(),
                yCollab(ytext, provider.awareness, { undoManager }),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const content = update.state.doc.toString();
                        console.log('Document content:', content);
                        // You can perform any action with the content here
                        updateContent(content);
                    }
                })
            ]
        })

        const view = new EditorView({ state, parent: editorRef.current })
        viewRef.current = view;

        return () => {
            view.destroy();
            provider.destroy();
        };
    }, []);

    useEffect(() => {
        console.log('Editor content updated:', editorContent);
        if (viewRef.current) {
            const currentContent = viewRef.current.state.doc.toString();
            if (currentContent !== editorContent) {
                viewRef.current.dispatch({
                    changes: {from: 0, to: currentContent.length, insert: editorContent}
                });
            }
        }
    }, [editorContent]);

    return <div className={styles.editor} ref={editorRef} />;
};

export default Editor;

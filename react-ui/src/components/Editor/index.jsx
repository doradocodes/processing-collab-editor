import React, {useEffect, useRef, useState} from 'react';
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { WebsocketProvider } from 'y-websocket'

import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";

import * as random from 'lib0/random'
import {java} from "@codemirror/lang-java";

import styles from './index.module.css';
import {useEditorStore} from "../../store/editorStore.js";
import {materialLight, materialDark} from "@uiw/codemirror-theme-material";

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

const Editor = ({ isDarkTheme }) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const renderEditor = () => {
        editorRef.current.innerHTML = '';

        let provider = null;

        const extensions = [
            basicSetup,
            isDarkTheme? materialDark : materialLight,
            EditorView.theme({
                "&": {
                    backgroundColor: "white"
                }
            }),
            java(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    const content = update.state.doc.toString();
                    console.log('Document content:', content);
                    // You can perform any action with the content here
                    setCurrentSketch({
                        ...currentSketch,
                        content,
                    });
                }
            })
        ]

        if (currentSketch.isCollab) {
            const userColor = userColors[random.uint32() % userColors.length]

            const ydoc = new Y.Doc()
            provider = new WebsocketProvider('ws://pce-server.glitch.me/1234', currentSketch.fileName, ydoc)
            console.log('Connecting to', 'ws://pce-server.glitch.me/1234', currentSketch.fileName);
            const ytext = ydoc.getText('codemirror')

            const undoManager = new Y.UndoManager(ytext)

            provider.awareness.setLocalStateField('user', {
                name: 'Anonymous ' + Math.floor(Math.random() * 100),
                color: userColor.color,
                colorLight: userColor.light
            });
            extensions.push(yCollab(ytext, provider.awareness, { undoManager }));
        }

        const state = EditorState.create({
            doc: currentSketch.content,
            extensions,
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

    // useEffect(() => {
    //     if (currentSketch.isCollab) {
    //         renderEditor();
    //     }
    //
    // }, [currentSketch]);

    useEffect(() => {
        renderEditor();
    }, [isDarkTheme]);

    useEffect(() => {
        renderEditor();
    }, []);

    useEffect(() => {
        if (viewRef.current) {
            const currentContent = viewRef.current.state.doc.toString();
            if (currentContent !== currentSketch.content) {
                viewRef.current.dispatch({
                    changes: {from: 0, to: currentContent.length, insert: currentSketch.content}
                });
            }
        }
    }, [currentSketch]);

    return <div className={styles.editor} ref={editorRef} />;
};

export default Editor;

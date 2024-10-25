import React, {useEffect, useRef, useState} from 'react';
import * as Y from 'yjs'
import {yCollab} from 'y-codemirror.next'

import {basicSetup, EditorView} from "codemirror";
import {keymap} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {indentWithTab} from "@codemirror/commands";
import {java} from "@codemirror/lang-java";

import styles from './../Editor/index.module.css';
import {githubLight, githubDark} from "@uiw/codemirror-theme-github";
import {Spinner} from "@radix-ui/themes";
import {useEditorStore} from "../../store/editorStore.js";

const CollabEditor = ({theme, sketchContent, yDoc, provider, onChange, onSave, isDocLoading}) => {
    const [fontSize, setFontSize] = useState(12);

    const editorRef = useRef(null);
    const viewRef = useRef(null);

    const isLoading = useEditorStore(state => state.isLoading);
    const isFocused = useEditorStore(state => state.isFocused);

    useEffect(() => {
        viewRef.current?.focus();
    }, [isFocused]);

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
    }, [sketchContent]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.metaKey && event.key === '=') {
                event.preventDefault();
                setFontSize(fontSize => fontSize + 1);
            }

            if (event.metaKey && event.key === '-') {
                event.preventDefault();
                setFontSize(fontSize => fontSize - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [fontSize]);

    const getExtensions = () => {
        const doc = yDoc || new Y.Doc();
        const ytext = doc.getText('codemirror');
        const undoManager = new Y.UndoManager(ytext);
        const extensions = [
            basicSetup,
            theme === 'dark' ? githubDark : githubLight,
            EditorView.theme({
                ".cm-content": {
                    fontSize: fontSize + 'px'
                },
                ".cm-gutters": {
                    fontSize: fontSize + 'px'
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
            provider && yCollab(ytext, provider.awareness, {undoManager})
        ];
        return extensions;
    }

    useEffect(() => {
        editorRef.current.innerHTML = '';

        const state = EditorState.create({
            extensions: getExtensions(),
            doc: sketchContent,
        })

        const view = new EditorView({
            state,

            parent: editorRef.current
        });
        viewRef.current = view;

        return () => {
            viewRef?.current?.destroy();
            console.log('Editor destroyed');
        };
    }, [theme, fontSize]);

    return [
        <div className={styles.editor} ref={editorRef} data-theme={theme} data-is-collab="true" data-is-loading={isDocLoading || isLoading}/>,
        // isDocLoading && <Spinner className={styles.spinner} size="20px" color="#1be7ff"/>
    ];
};

export default CollabEditor;


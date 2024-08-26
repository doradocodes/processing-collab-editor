import React, {useEffect, useRef, useState, useCallback} from 'react';
import CodeMirror, {Decoration, WidgetType} from '@uiw/react-codemirror';

import {basicSetup, EditorView} from "codemirror"
import {java} from "@codemirror/lang-java";
import styles from './index.module.css';
import {useEditorStore} from "../../store/editorStore.js";
import {collab, getSyncedVersion, receiveUpdates, sendableUpdates} from "@codemirror/collab";
import {ChangeSet, EditorState, RangeSetBuilder} from '@codemirror/state';
import {socket} from "../../socket.js";

const RemoteCursorWidget = () => {
    const span = document.createElement("span");
    span.className = "remote-cursor";
    span.style.borderLeft = "2px solid red";  // Customize cursor appearance
    span.style.height = "1em";
    span.style.marginLeft = "-1px";  // Aligns with text cursor
    return span;
};

const CodeMirrorComponent = () => {
    const [value, setValue] = React.useState("test");
    const editorRef = useRef(null);
    const [initState, setInitState] = useState(null);
    const [cursorPosition, setCursorPosition] = useState(null);

    useEffect(() => {
        console.log('CodeMirrorComponent loaded');

        socket.on('update', (updateObj) => {
            console.log('received update', updateObj);
            // let received = updateObj.updates.slice(-1).map(json => ({
            //     clientID: json.clientID,
            //     changes: ChangeSet.fromJSON(json.changes)
            // }))
            // console.log('received', received);
            // const viewUpdate = receiveUpdates(editorRef.current.view.state, received);
            // editorRef.current.view.update([viewUpdate]);

            setCursorPosition(updateObj.cursorPosition);
        });

        setCursorPosition();
    }, []);

    const createRemoteCursorDecorations = (remoteCursor) => {
        const builder = new RangeSetBuilder();
        // const pos = remoteCursor.ranges[0].head;
        const cursor = Decoration.widget({
            widget: new class extends WidgetType {
                toDOM() {
                    return RemoteCursorWidget();
                }
            },
            side: 1
        }).range(1);
        builder.add(1, 1, cursor);
        return builder.finish();
    };

    const onChange = useCallback((val, viewUpdate) => {
        const updates = sendableUpdates(viewUpdate.state);
        const version = getSyncedVersion(viewUpdate.state);
        console.log('sending update', updates, version);
        const obj = {
            updates: updates,
            version: version,
            cursorPosition: viewUpdate.state.selection
        };
        socket.emit('update', obj, () => {
            console.log('sent update', obj);
        });


        // const editorHeight = editor.dom.clientHeight;
        // setEditorHeight(editorHeight);
    }, []);

    // if (cursorPosition) {
    //     extensions.push();
    // }

    return <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        extensions={[
            java(),
            collab({
                startVersion: 1
            }),
            // EditorView.decorations.of(createRemoteCursorDecorations())
        ]}
        onChange={onChange}
    />;
};

export default CodeMirrorComponent;

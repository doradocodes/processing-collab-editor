import React, {createRef, useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, getSketchFolders, updateSketch} from "../../utils/localStorage.js";
import {Button, Card, Flex, Heading, Separator, Text, TextField} from "@radix-ui/themes";
import {FaceIcon, FileIcon, PersonIcon} from "@radix-ui/react-icons";

const Sketches = () => {
    const sketchNameInput = createRef();
    const userNameInput = createRef();
    const [sketchList, setSketchList] = useState([]);
    const [error, setError] = useState(null);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    useEffect(() => {
        if (!currentSketch.fileName) {
            getSketchFolders()
                .then(folders => {
                    const lastSavedSketch = folders[folders.length - 1];
                    if (lastSavedSketch) {
                        getSketchFile(lastSavedSketch)
                            .then(content => {
                                setCurrentSketch({
                                    fileName: lastSavedSketch,
                                    content,
                                    isCollab: false,
                                    isHost: false,
                                });
                            });
                    }
                    return null;
                });
        }
    }, []);

    useEffect(() => {
        getSketchFolders().then(folders => {
            setSketchList(folders);
        });
    }, [currentSketch]);

    const onCreateSketch = async () => {
        const fileName = `sketch_${new Date().getTime()}`;
        setCurrentSketch({
            fileName,
            content: '',
            isCollab: false,
            isHost: false,
        });
        const folderPath = await updateSketch(fileName, currentSketch.content);
        const folders = await getSketchFolders();
        setSketchList(folders);
    }

    const onGetSketchFile = async (fileName) => {
        const content = await getSketchFile(fileName);
        setCurrentSketch({
            fileName,
            content,
            isCollab: false,
            isHost: false,
        });
    }

    const joinSketch = async () => {
        const fileName = sketchNameInput.current.value;
        if (!fileName) {
            setError('Please enter a sketch name');
            return;
        }
        console.log('username:', userNameInput.current.value)
        console.log('Joining sketch:', fileName);
        setCurrentSketch({
            fileName,
            content: '',
            isCollab: true,
            isHost: false,
        });
    };

    const formatUnsavedFileName = (fileName) => {
        const timestamp = fileName.slice(fileName.lastIndexOf('_') + 1);
        return `[Unsaved sketch - ${new Date(parseInt(timestamp)).toLocaleString()}]`;
    }

    return <div className={styles.sketches}>
        <Flex direction="column" gap="3">
            <Flex direction="column" gap="3" className={styles.wrapper}>
                <Text size="1" className={styles.subheader}>Join a sketch</Text>
                <TextField.Root placeholder="Enter your name" ref={userNameInput}>
                    <TextField.Slot>
                        <PersonIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <TextField.Root placeholder="Enter sketch name" ref={sketchNameInput}>
                    <TextField.Slot>
                        <FileIcon height="16" width="16" />
                    </TextField.Slot>
                </TextField.Root>
                <Button onClick={joinSketch}>Join</Button>
                {error && <Text size="1" className={styles.error}>{error}</Text>}
            </Flex>
            <Button variant="surface" onClick={onCreateSketch}>Create a new sketch</Button>
        </Flex>

        <div className={styles.sketchListWrapper}>
            <Text size="1" className={styles.subheader}>Unsaved sketches</Text>
            <div className={styles.sketchList}>
                { !currentSketch.fileName &&
                    <div className={styles.sketchItem} data-active={!currentSketch.fileName}>
                        <Text size="1">[Unsaved sketch]</Text>
                    </div>
                }
                {sketchList
                    .filter(fileName => {
                        return fileName.indexOf('sketch_') === 0;
                    })
                    .map((fileName) => {
                        return <div
                            className={styles.sketchItem}
                            data-active={currentSketch.fileName === fileName}
                            key={fileName}
                            onClick={(e) => onGetSketchFile(fileName)}
                        >
                            <Text size="1">{formatUnsavedFileName(fileName)}</Text>
                        </div>
                    })}
            </div>
            <Text size="1" className={styles.subheader}>Saved sketches</Text>
            <div className={styles.sketchList}>
                {sketchList
                    .filter(fileName => {
                        return fileName.indexOf('sketch_') < 0;
                    })
                    .map((fileName) => {
                        return <div
                            className={styles.sketchItem}
                            data-active={currentSketch.fileName === fileName}
                            key={fileName}
                            onClick={(e) => onGetSketchFile(fileName)}
                        >
                            <Text size="1">{fileName}</Text>
                        </div>
                    })}
            </div>
        </div>
    </div>
}

export default Sketches;

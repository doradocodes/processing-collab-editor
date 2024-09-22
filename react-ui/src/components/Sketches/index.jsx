import React, {createRef, useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, getSketchFolders, updateSketch} from "../../utils/localStorage.js";
import {Button, Card, Flex, Heading, Separator, Text, TextField} from "@radix-ui/themes";
import {FaceIcon, FileIcon, GlobeIcon, PersonIcon, Share1Icon} from "@radix-ui/react-icons";
import Index from "../JoinCollaborativeSketchDialog/index.jsx";

const Sketches = () => {
    const sketchNameInput = createRef();
    const userNameInput = createRef();
    const [sketchList, setSketchList] = useState([]);

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
            return;
        }
        console.log('username:', userNameInput.current.value)
        console.log('Joining sketch:', fileName);

        // create new local sketch -> mabye only after host disconnects?
        const folderPath = await updateSketch(`collab_${fileName}`, '');

        setCurrentSketch({
            fileName,
            content: '',
            userName: userNameInput.current.value,
            isCollab: true,
            isHost: false,
        });

        const folders = await getSketchFolders();
        setSketchList(folders);
    };

    const formatUnsavedFileName = (fileName) => {
        if (fileName.indexOf('sketch_') === 0) {
            const timestamp = fileName.slice(fileName.lastIndexOf('_') + 1);
            return <Text size="2" truncate={true}>Unsaved sketch - ${new Date(parseInt(timestamp)).toLocaleString()}</Text>;
        }
        if (fileName.indexOf('collab_') === 0) {
            const formattedFileName = fileName.slice(fileName.indexOf('_') + 1);
            return [
                <Text size="2" truncate={true}>{formattedFileName}</Text>,
                <Share1Icon
                    height="16" width="16"
                    color={currentSketch.isCollab && currentSketch.fileName === formattedFileName ? 'green' : 'black'}
                />
            ]
        }
        return <Text size="2" truncate={true}>{fileName}</Text>;
    }

    return <div className={styles.sketches}>
        <div className={styles.sketchListWrapper}>
            <Text size="1" className={styles.subheader}>Sketches</Text>
            <div className={styles.sketchList}>
                {sketchList
                    .map((fileName) => {
                        return <div
                            className={styles.sketchItem}
                            data-active={currentSketch.fileName === fileName}
                            key={fileName}
                            onClick={(e) => onGetSketchFile(fileName)}
                        >
                            <Flex align="center" gap="1">
                                {formatUnsavedFileName(fileName)}
                            </Flex>
                        </div>
                    })}
            </div>
        </div>
        <Flex direction="column" gap="2">
            <Flex direction="column" gap="3">
                <Index
                    trigger={<Button>Join a sketch</Button>}
                    onClick={joinSketch}
                />
            </Flex>
            <hr />
            <Button variant="surface" onClick={onCreateSketch}>Create a new sketch</Button>
        </Flex>
    </div>
}

export default Sketches;

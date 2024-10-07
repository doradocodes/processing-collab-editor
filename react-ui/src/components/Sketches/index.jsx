import React, {createRef, useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, getSketchFolders, updateSketch} from "../../utils/localStorageUtils.js";
import {Button, Card, Flex, Heading, Separator, Text, TextField} from "@radix-ui/themes";
import {FaceIcon, FileIcon, GlobeIcon, PersonIcon, Share1Icon} from "@radix-ui/react-icons";
import JoinCollaborativeSketchDialog from "../JoinCollaborativeSketchDialog/index.jsx";
import {formatSketchName} from "../../utils/utils.js";

const Sketches = () => {
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
                                    ...currentSketch,
                                    fileName: lastSavedSketch,
                                    content,
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

    return <div className={styles.sketches}>
        <div className={styles.sketchListWrapper}>
            <Text size="1" className={styles.subheader}>Sketches</Text>
            <div className={styles.sketchList}>
                {sketchList
                    .map((fileName, i) => {
                        return <div
                            className={styles.sketchItem}
                            data-active={currentSketch.fileName === fileName}
                            key={`${fileName}-${i}`}
                            onClick={(e) => onGetSketchFile(fileName)}
                        >
                            <Flex align="center" gap="1" key={i}>
                                <Text size="2" truncate={true}>{formatSketchName(fileName)}</Text>
                            </Flex>
                        </div>
                    })}
            </div>
        </div>
        <Flex direction="column" gap="2">
            <Button variant="surface" onClick={onCreateSketch}>Create a new sketch</Button>
            <hr/>
            <Flex direction="column" gap="3">
                <JoinCollaborativeSketchDialog
                    trigger={<Button>Join a collaborative sketch</Button>}
                    onSubmit={async () => {
                        const folders = await getSketchFolders();
                        setSketchList(folders);
                    }}
                />
            </Flex>
        </Flex>
    </div>
}

export default Sketches;

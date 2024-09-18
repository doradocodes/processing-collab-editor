import React, {createRef, useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, getSketchFolders} from "../../utils/localStorage.js";
import {Button, Card, Flex, Heading, TextField} from "@radix-ui/themes";
import {FaceIcon, FileIcon, PersonIcon} from "@radix-ui/react-icons";

const Sketches = () => {
    const sketchNameInput = createRef();
    const userNameInput = createRef();
    const [sketchList, setSketchList] = useState([]);
    const [activeSketch, setActiveSketch] = useState(null);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    useEffect(() => {
        getSketchFolders()
            .then((folders) => {
                console.log('files', folders);
                setSketchList(folders);
            });
    }, [currentSketch]);

    useEffect(() => {
        if (currentSketch.fileName) {
            setActiveSketch(currentSketch.fileName);
        }
    }, [currentSketch]);

    const onCreateSketch = async () => {
        // const folders = await getSketchFolders();
        // setFolders(folders);
    }

    const onGetSketchFile = async (fileName) => {
        const content = await getSketchFile(fileName);
        setCurrentSketch({
            fileName,
            content,
            isCollab: false,
        });
    }

    const joinSketch = async () => {
        const fileName = sketchNameInput.current.value;
        if (!fileName) {
            return;
        }
        console.log('username:', userNameInput.current.value)
        console.log('Joining sketch:', fileName);
        setCurrentSketch({
            fileName,
            content: '',
            isCollab: true,
        });
    };

    return <div className={styles.sketches}>
        <Flex gap="2" direction="column">
            <Heading as="h6">Recent sketches</Heading>
            <Flex direction="column" gap="3">
                {!activeSketch &&
                    <Card className={!activeSketch && styles.active}>
                        <span>[Untitled]</span>
                    </Card>
                }
                {sketchList.map((fileName) => {
                    return <Card
                        className={activeSketch === fileName && styles.active}
                        key={fileName}
                        onClick={(e) => onGetSketchFile(fileName)}
                    >
                        <span>{fileName}</span>
                    </Card>
                })}
            </Flex>
        </Flex>


        <Flex direction="column" gap="3">
            <Flex direction="column" gap="3">
                <Heading as="h6">Join a sketch</Heading>
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
            </Flex>
            <hr/>
            <Button variant="surface" onClick={onCreateSketch}>Create a new sketch</Button>
        </Flex>
    </div>
}

export default Sketches;

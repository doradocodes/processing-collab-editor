import {useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, updateSketch} from "../../utils/localStorageUtils.js";
import {Badge, Button, Flex, Text} from "@radix-ui/themes";
import JoinCollaborativeSketchDialog from "../JoinCollaborativeSketchDialog/index.jsx";
import {useSketchesStore} from "../../store/sketchesStore.js";
import {useWebsocketStore} from "../../store/websocketStore.js";
import SketchDropdownMenu from "../SketchDropdownMenu/index.jsx";

const Sketches = ({onOpenRenameDialog}) => {
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const files = useSketchesStore(state => state.files);
    const updateFilesFromLocalStorage = useSketchesStore(state => state.updateFilesFromLocalStorage);

    const isConnected = useWebsocketStore(state => state.isConnected);

    useEffect(() => {
        if (!currentSketch.fileName) {
            updateFilesFromLocalStorage()
                .then((files) => {
                    const lastSavedSketch = files[0];
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
                });
        }
    }, []);

    const onCreateSketch = async () => {
        const fileName = `sketch_${new Date().getTime()}`;
        setCurrentSketch({
            fileName,
            content: '',
            isCollab: false,
            isHost: false,
        });
        await updateSketch(fileName, currentSketch.content);
        await updateFilesFromLocalStorage();
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

    function formatSketchName(name) {
        if (!name) {
            return 'Untitled sketch';
        }
        if (name.indexOf('sketch_') === 0) {
            const formattedTimestamp = new Date(parseInt(name.split('_')[1])).toLocaleString();
            return `Untitled sketch (${formattedTimestamp})`;
        }
        if (name.indexOf('collab_') === 0) {
            return name.replace('collab_', '') + ' (Copy)';
        }
        return name.replaceAll('_', ' ');
    }

    return <div className={styles.sketches}>
        <div className={styles.sketchListWrapper}>
            <Text size="1" className={styles.subheader}>Sketches</Text>
            <div className={styles.sketchList}>
                {files
                    .map((fileName, i) => {
                        return <div
                            className={styles.sketchItem}
                            data-active={currentSketch.fileName === fileName}
                            data-is-connected={(currentSketch.fileName === fileName) && isConnected}
                            key={`${fileName}-${i}`}
                            onClick={() => onGetSketchFile(fileName)}
                        >
                            <Flex align="center" justify="between" gap="1" key={i}>
                                <Text size="2" truncate={true} mr="1">{formatSketchName(fileName)}</Text>
                                <SketchDropdownMenu
                                    onRename={onOpenRenameDialog}
                                    hasCollab={true}
                                />
                            </Flex>
                        </div>
                    })}
            </div>
        </div>
        <Flex direction="column" gap="1" className={styles.buttonWrapper}>
            <Button radius="large" variant="surface" onClick={onCreateSketch}>Create new sketch</Button>
            <hr/>
            <Flex direction="column" gap="3">
                <JoinCollaborativeSketchDialog
                    isOpen={isJoinDialogOpen}
                    trigger={<Button radius="large" onClick={() => setIsJoinDialogOpen(true)}>Join collaborative sketch</Button>}
                    onSubmit={async () => {
                        await updateFilesFromLocalStorage();
                    }}
                    onClose={() => setIsJoinDialogOpen(false)}
                />
            </Flex>
        </Flex>
    </div>
}

export default Sketches;

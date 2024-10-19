import {useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, updateSketch} from "../../utils/localStorageUtils.js";
import {Button, Flex, Text} from "@radix-ui/themes";
import {useSketchesStore} from "../../store/sketchesStore.js";
import {useWebsocketStore} from "../../store/websocketStore.js";
import SketchDropdownMenu from "../SketchDropdownMenu/index.jsx";
import JoinCollaborativeSketchDialog from "../JoinCollaborativeSketchDialog/index.jsx";

const Sketches = ({onOpenRenameDialog}) => {
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const isFocused = useEditorStore(state => state.isFocused);
    const setIsFocused = useEditorStore(state => state.setIsFocused);

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
        });
        await updateSketch(fileName, currentSketch.content);
        await updateFilesFromLocalStorage();
        setIsFocused(!isFocused);
    }

    const onGetSketchFile = async (fileName) => {
        const content = await getSketchFile(fileName);
        setCurrentSketch({
            fileName,
            content,
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

    return [
        <Flex gap="1" mb="2" justify="center" key={1}>
            <Button radius="large" variant="surface" onClick={onCreateSketch}>Create new</Button>
            <Flex direction="column" gap="3">
                <JoinCollaborativeSketchDialog
                    isOpen={isJoinDialogOpen}
                    trigger={<Button radius="large" onClick={() => setIsJoinDialogOpen(true)}>Join a sketch</Button>}
                    onSubmit={async () => {
                        await updateFilesFromLocalStorage();
                    }}
                    onClose={() => setIsJoinDialogOpen(false)}
                />
            </Flex>
        </Flex>,
        <div className={styles.sketches} key={2}>
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
        </div>
        ];
}

export default Sketches;

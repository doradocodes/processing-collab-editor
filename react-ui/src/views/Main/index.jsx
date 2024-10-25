import {useEditorStore} from "../../store/editorStore.js";
import {useState} from "react";
import {renameSketch, updateSketch} from "../../utils/localStorageUtils.js";
import {Flex, Heading, IconButton, Theme} from "@radix-ui/themes";
import {ViewVerticalIcon} from "@radix-ui/react-icons";
import styles from "../../App.module.css";
import SketchDropdownMenu from "../../components/SketchDropdownMenu/index.jsx";
import RenameSketchDialog from "../../components/RenameSketchDialog/index.jsx";
import PlayButton from "../../components/PlayButton/index.jsx";
import Sketches from "../../components/Sketches/index.jsx";
import Editor from "../../components/Editor/index.jsx";
import Console from "../../components/Console/index.jsx";
import {formatSketchName} from "../../utils/utils.js";
import DraggableElement from "../../components/DraggableIndicator/index.jsx";
import {useSketchesStore} from "../../store/sketchesStore.js";
import {useWebsocketStore} from "../../store/websocketStore.js";
import DisconnectAlertDialog from "../../components/DisconnectAlertDialog/index.jsx";
import {useParams} from "react-router-dom";

function Main() {
    const {theme} = useParams();

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const updateFilesFromLocalStorage = useSketchesStore(state => state.updateFilesFromLocalStorage)
    const isDisconnectDialogOpen = useWebsocketStore(state => state.isDisconnectDialogOpen)

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [consoleHeight, setConsoleHeight] = useState(100);

    const onOpenRenameDialog = () => {
        setIsRenameDialogOpen(true);
    }

    const onRename = async (newName) => {
        setCurrentSketch({
            ...currentSketch,
            fileName: newName,
        });
        await renameSketch(currentSketch.fileName, newName);
        await updateFilesFromLocalStorage();
    }

    const toggleLeftPanel = () => {
        setIsLeftPanelOpen(!isLeftPanelOpen);
    }

    const handleEditorChange = (content) => {
        setCurrentSketch({
            ...currentSketch,
            content
        });
    }

    const handleEditorSave = async () => {
        try {
            await updateSketch(currentSketch.fileName, currentSketch.content);
            console.log(currentSketch.content)
            setHasSaved(true);
            setTimeout(() => setHasSaved(false), 2000);
        } catch (e) {
            console.error(e);
        }
    }

    return <Theme
        appearance={theme}
        accentColor="blue"
    >
        <div className='App'>
            <div className={styles.grid} data-panel-open={isLeftPanelOpen}>
                <div className={styles.leftColumnHeader}>
                    <IconButton onClick={toggleLeftPanel} variant="ghost" mb="1">
                        <ViewVerticalIcon/>
                    </IconButton>
                </div>

                <div className={styles.rightColumnHeader}>
                    <Flex gap="3" align="center">
                        {!isLeftPanelOpen &&
                            <IconButton onClick={toggleLeftPanel} variant="ghost">
                                <ViewVerticalIcon/>
                            </IconButton>
                        }

                        <Heading
                            size="4"
                            truncate={true}
                            className={styles.sketchName}
                        >
                            {formatSketchName(currentSketch?.fileName)}
                        </Heading>

                        <SketchDropdownMenu
                            onRename={onOpenRenameDialog}
                            hasCollab={true}
                        />

                        <RenameSketchDialog
                            defaultValue={currentSketch.fileName}
                            isOpen={isRenameDialogOpen}
                            onSave={onRename}
                            onClose={() => setIsRenameDialogOpen(false)}
                        />

                        {hasSaved && <span>Saved!</span>}

                    </Flex>
                    <PlayButton/>
                </div>

                <div className={styles.leftColumn}>
                    <img className={styles.logo} src="./Processing-logo.png" alt="logo"/>
                    <Sketches
                        theme={theme}
                        onOpenRenameDialog={onOpenRenameDialog}
                    />
                </div>


                <div className={styles.rightColumn}>
                    <Editor
                        theme={theme}
                        sketchName={currentSketch.fileName}
                        sketchContent={currentSketch.content}
                        userName={currentSketch.userName}
                        onChange={handleEditorChange}
                        onSave={handleEditorSave}
                    />
                    <div className={styles.layoutResize}>
                        <DraggableElement
                            onDrag={(height) => {
                                setConsoleHeight(height);
                            }}
                        />
                    </div>
                    {<Console theme="dark" height={consoleHeight}/>}
                </div>
            </div>

            {isDisconnectDialogOpen && <DisconnectAlertDialog isOpen={true}/>}
        </div>
    </Theme>
}

export default Main;

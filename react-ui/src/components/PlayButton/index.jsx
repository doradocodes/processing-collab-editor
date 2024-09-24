import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorage.js";
import {Button, IconButton} from "@radix-ui/themes";
import {PlayIcon} from "@radix-ui/react-icons";

const PlayButton = () => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    const onClick = async () => {
        let fileName = currentSketch.fileName;
        let folderPath = '';
        if (!currentSketch.fileName) {
            fileName = `sketch_${new Date().getTime()}`;
            setCurrentSketch({
                ...currentSketch,
                fileName,
            });
            folderPath = await updateSketch(fileName, currentSketch.content);
        } else {
            folderPath = await updateSketch(currentSketch.fileName, currentSketch.content);

        }

        window.electronAPI.runProcessing(folderPath);
    };

    return (
        <IconButton
            size="3"
            onClick={onClick}
            radius="full"
        >
            <PlayIcon width="24" height="24"/>
        </IconButton>
    );
}

export default PlayButton;

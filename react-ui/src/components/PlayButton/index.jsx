import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorageUtils.js";
import {Button, IconButton} from "@radix-ui/themes";
import PlayIcon from './../../assets/play_icon.png';
import {useEffect, useState} from "react";

const PlayButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setIsLoading(false);
        });
        window.electronAPI.onProcessingOutputError((data) => {
            setIsLoading(false);
            setIsPlaying(false);
        });
    }, []);

    const onClick = async () => {
        if (isPlaying) {
            window.electronAPI.stopProcessing();
            setIsPlaying(false);
            return;
        }

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

        setIsLoading(true);
        setIsPlaying(true);
        window.electronAPI.runProcessing(folderPath);
    };

    return (
        <IconButton
            size="3"
            onClick={onClick}
            radius="full"
            loading={isLoading}
            className={styles.playButton}
        >
            {isPlaying ?
                <span className={styles.stopButton}></span>
                :
                <img src={PlayIcon} alt="Play"/>
            }

            {/*<PlayIcon width="24" height="24"/>*/}
        </IconButton>
    );
}

export default PlayButton;

import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorageUtils.js";
import {IconButton} from "@radix-ui/themes";
import PlayIcon from './../../assets/play_icon.svg';
import {useEffect, useState} from "react";

const PlayButton = () => {
    const isLoading = useEditorStore(state => state.isLoading);
    const setIsLoading = useEditorStore(state => state.setIsLoading);
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    useEffect(() => {
        window.electronAPI.onProcessingOutput(() => {
            setIsLoading(false);
        });
        window.electronAPI.onProcessingOutputError(() => {
            setIsLoading(false);
        });
    }, []);

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

        setIsLoading(true);
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
            <img src={PlayIcon} alt="Play"/>
        </IconButton>
    );
}

export default PlayButton;

import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorage.js";

const PlayButton = () => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    // const isLoading = useEditorStore(state => state.isLoading);
    // const setIsLoading = useEditorStore(state => state.setIsLoading);

    const onClick = async () => {
        // setIsLoading(true);

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

        // console.log('Running sketch:', folderPath);
        window.electronAPI.runProcessing(folderPath);
    };

    return (
        <button
            className={styles.playButton}
            // data-is-loading={isLoading}
            // disabled={isLoading}
            onClick={onClick}
        />
    );
}

export default PlayButton;

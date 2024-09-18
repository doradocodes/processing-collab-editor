import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';
import {updateSketch} from "../../utils/localStorage.js";

const PlayButton = () => {
    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);
    const isLoading = useEditorStore(state => state.isLoading);
    const setIsLoading = useEditorStore(state => state.setIsLoading);

    const onClick = async () => {
        setIsLoading(true);

        const fileName = currentSketch.fileName || `sketch_${new Date().getTime()}`;
        if (!currentSketch.fileName) {
            await setCurrentSketch({
                ...currentSketch,
                fileName,
            });
        }
        await updateSketch(fileName, currentSketch.content || '');
        console.log('currentSketch:', currentSketch);
        window.electronAPI.runProcessing(fileName);
    };

    return (
        <button
            className={styles.playButton}
            data-is-loading={isLoading}
            disabled={isLoading}
            onClick={onClick}
        />
    );
}

export default PlayButton;

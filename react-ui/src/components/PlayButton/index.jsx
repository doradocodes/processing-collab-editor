import {useEditorStore} from "../../store/editorStore.js";
import styles from './index.module.css';

const PlayButton = () => {
    const editorContent = useEditorStore(state => state.editorContent);
    const isLoading = useEditorStore(state => state.isLoading);
    const setIsLoading = useEditorStore(state => state.setIsLoading);

    const onClick = () => {
        setIsLoading(true)
        const content = editorContent;
        const fileName = `sketch_${new Date().getTime()}`;
        window.electronAPI.runProcessing(fileName, content);
    };

    return (
        isLoading ? <LoadingSpinner /> :
        <button
            className={styles.playButton}
            disabled={isLoading}
            onClick={onClick}
        />
    );
}

export default PlayButton;

const LoadingSpinner = () => {
    return <div className={styles.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
}

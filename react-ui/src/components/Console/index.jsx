import styles from "./index.module.css";
import {useEffect, useState} from "react";
import {useEditorStore} from "../../store/editorStore.js";

const Console = () => {
    const [output, setOutput] = useState('Console');
    const setIsLoading = useEditorStore(state => state.setIsLoading);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            console.log('output', data)
            setOutput(data);
            setIsLoading(false);
        }); // move to store?
    }, []);

    return (
        <div className={styles.console}>
            <div className={styles.output}>{output}</div>
        </div>
    )
}

export default Console;

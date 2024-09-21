import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";
import {useEditorStore} from "../../store/editorStore.js";

const Console = ({ isDarkTheme = false }) => {
    const consoleRef = useRef(null);
    const [output, setOutput] = useState([]);
    // const setIsLoading = useEditorStore(state => state.setIsLoading);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput((prevOutput) => [...prevOutput, data]);
            // setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div className={styles.console} data-theme={isDarkTheme ? 'dark':'light'} ref={consoleRef}>
            <div className={styles.output}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
        </div>
    )
}

export default Console;

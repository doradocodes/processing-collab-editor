import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";
import {useEditorStore} from "../../store/editorStore.js";

const Console = ({ isDarkTheme = false }) => {
    const consoleRef = useRef(null);
    const [output, setOutput] = useState(['test ouptut', 'test ouptut', 'test ouptut', 'test ouptut', 'test ouptut']);
    const setIsLoading = useEditorStore(state => state.setIsLoading);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput([...output, data]);
            setIsLoading(false);
            //scroll to bottom
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }); // move to store?
    }, []);

    const addTestOutput = () => {
        setOutput([...output, 'test ouptut']);
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }

    return (
        <div className={styles.console} data-theme={isDarkTheme ? 'dark':'light'} ref={consoleRef} onClick={addTestOutput}>
            <div className={styles.output}>
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
        </div>
    )
}

export default Console;

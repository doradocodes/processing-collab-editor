import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";

const Console = ({theme = 'light', height}) => {
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
        <div
            className={styles.console}
            data-theme={theme}
            ref={consoleRef}
            style={{height: height}}
        >
            <div className={styles.output}>
                {output.length < 1 && <span className={styles.prompt}>Console</span>}
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
        </div>

    )
}

export default Console;

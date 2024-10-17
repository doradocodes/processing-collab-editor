import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";

const Console = ({theme = 'light', height}) => {
    const consoleRef = useRef(null);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                <div className={styles.error}>{data}</div>,
            ]);
        });
        window.electronAPI.onProcessingOutputError((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                <div className={styles.error}>{data}</div>
            ]);
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
                {output.length > 0 ? output : <span className={styles.prompt}>Console</span>}
            </div>
        </div>

    )
}

export default Console;

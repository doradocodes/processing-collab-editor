import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";
import {Text} from "@radix-ui/themes";

const Console = ({theme = 'light', height}) => {
    const consoleRef = useRef(null);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                <Text>{data}</Text>,
            ]);
        });
        window.electronAPI.onProcessingOutputError((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                <Text color="red">{data}</Text>
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

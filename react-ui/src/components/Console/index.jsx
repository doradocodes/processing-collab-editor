import styles from "./index.module.css";
import {useEffect, useRef, useState} from "react";
import {Text} from "@radix-ui/themes";
import {useEditorStore} from "../../store/editorStore.js";

const Console = ({theme = 'light', height}) => {
    const consoleRef = useRef(null);
    const [output, setOutput] = useState([]);
    const isLoading = useEditorStore(state => state.isLoading);

    useEffect(() => {
        if (isLoading) {
            setOutput([]);
        }
    }, [isLoading]);

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                // eslint-disable-next-line react/jsx-key
                <Text>{data}</Text>,
            ]);
        });
        window.electronAPI.onProcessingOutputError((data) => {
            setOutput((prevOutput) => [
                ...prevOutput,
                // eslint-disable-next-line react/jsx-key
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

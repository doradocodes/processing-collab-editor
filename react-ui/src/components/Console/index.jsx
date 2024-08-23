import styles from "./index.module.css";
import {useEffect, useState} from "react";

const Console = () => {
    const [output, setOutput] = useState('Console');

    useEffect(() => {
        window.electronAPI.onProcessingOutput((data) => {
            setOutput(data);
        }); // move to store?
    }, []);

    return (
        <div className={styles.console}>
            <div className={styles.output}>{output}</div>
        </div>
    )
}

export default Console;

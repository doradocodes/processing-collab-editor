import React, {useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {createNewSketch, getSketchFile, getSketchFolders} from "../../utils/localStorage.js";

const Sketches = () => {
    const [folders, setFolders] = useState([]);
    const updateContent = useEditorStore(state => state.updateContent);
    const updateCurrentSketch = useEditorStore(state => state.updateCurrentSketch);

    useEffect(() => {
        getSketchFolders()
            .then((folders) => {
                console.log('folders', folders);
                setFolders(folders);
            });
    }, []);

    const onCreateSketch = async () => {
        await createNewSketch();
        const folders = await getSketchFolders();
        setFolders(folders);
    }

    const onGetSketchFile = async (folder) => {
        const fileContent = await getSketchFile(folder);
        updateCurrentSketch(folder);
        updateContent(fileContent);
    }

    return <div className={styles.wrapper}>
        <ul className={styles.list}>
            <li className={styles.listItem} onClick={onCreateSketch}>Create new sketch</li>
            <h2 className={styles.sectionLabel}>Recent sketches</h2>
            {folders.map((folder) => {
                return <li className={styles.listItem} key={folder} onClick={(e) => onGetSketchFile(folder)}>
                    <span>{folder}</span>
                </li>
            })}
            <h2 className={styles.sectionLabel}>Join a sketch</h2>
            <li className={styles.listItem}>
                <input type="text" placeholder="Enter sketch name"/>
                <button>Join</button>
            </li>
        </ul>
    </div>
}

export default Sketches;

import React, {createRef, useEffect, useState} from "react";
import styles from "./index.module.css";
import {useEditorStore} from "../../store/editorStore.js";
import {getSketchFile, getSketchFolders} from "../../utils/localStorage.js";

const Sketches = () => {
    const sketchNameInput = createRef();
    const [sketchList, setSketchList] = useState([]);
    const [activeSketch, setActiveSketch] = useState(null);

    const currentSketch = useEditorStore(state => state.currentSketch);
    const setCurrentSketch = useEditorStore(state => state.setCurrentSketch);

    useEffect(() => {
        getSketchFolders()
            .then((folders) => {
                console.log('files', folders);
                setSketchList(folders);
            });
    }, [currentSketch]);

    useEffect(() => {
        if (currentSketch.fileName) {
            setActiveSketch(currentSketch.fileName);
        }
    }, [currentSketch]);

    const onCreateSketch = async () => {
        // const folders = await getSketchFolders();
        // setFolders(folders);
    }

    const onGetSketchFile = async (fileName) => {
        const content = await getSketchFile(fileName);
        setCurrentSketch({
            fileName,
            content,
            isCollab: false,
        });
    }

    const joinSketch = async () => {
        const fileName = sketchNameInput.current.value;
        if (!fileName) {
            return;
        }
        console.log('Joining sketch:', fileName);
        setCurrentSketch({
            fileName,
            content: '',
            isCollab: true,
        });
    };

    return <div className={styles.sketches}>
        <div>
            <h2 className={styles.sectionLabel}>Recent sketches</h2>
            <ul className={styles.list}>
                {!activeSketch &&
                    <li className={styles.listItem} data-active="true">
                        <span>[Untitled]</span>
                    </li>
                }
                {sketchList.map((fileName) => {
                    return <li
                        className={styles.listItem}
                        data-active={activeSketch === fileName ? 'true' : 'false'}
                        key={fileName}
                        onClick={(e) => onGetSketchFile(fileName)}
                    >
                        <span>{fileName}</span>
                    </li>
                })}
            </ul>
        </div>


        <div className={styles.wrapper}>
            <div className={styles.wrapper}>
                <h2 className={styles.sectionLabel}>Join a sketch</h2>
                <input className={styles.input} type="text" placeholder="Enter your name"/>
                <input ref={sketchNameInput} className={styles.input} type="text" placeholder="Enter sketch name"/>
                <button onClick={joinSketch}>Join</button>
            </div>
            <hr/>
            <div className={styles.wrapper}>
                <button onClick={onCreateSketch}>Create a new sketch</button>
            </div>
        </div>
    </div>
}

export default Sketches;

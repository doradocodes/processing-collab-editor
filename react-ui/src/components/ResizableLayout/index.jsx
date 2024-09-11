import React from "react";
import styles from "./index.module.css";
import CodeMirrorComponent from "../CodeMirrorComponent/index.jsx";
import Console from "../Console/index.jsx";
import Index from "../Editor/index.jsx";

const ResizableLayout = ({ children }) => {

    return <div className={styles.layout}>
        {/*<CodeMirrorComponent/>*/}
        <Index />
        <div>
            <div className={styles.draggableIndicator} />
        </div>
        <Console />
    </div>
}

export default ResizableLayout;

import React, {useEffect, useState} from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Main from "./views/Main/index.jsx";
import './App.css';
import {Theme} from "@radix-ui/themes";

function App() {
    const [theme, setTheme] = useState('light');



    useEffect(() => {
        window.electronAPI.onSetTheme((newTheme) => {
            console.log('Theme:', newTheme)
            setTheme(newTheme);
        });
    }, []);

    return <Theme
        appearance={theme}
        accentColor="indigo"
        panelBackground="translucent"
        radius="medium"
    >
        <Main theme={theme} />
    </Theme>
}

export default App

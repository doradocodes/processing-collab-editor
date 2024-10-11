import React, {useEffect, useState} from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Main from "./views/Main/index.jsx";
import Settings from "./views/Settings/index.jsx";
import './App.css';
import {Theme} from "@radix-ui/themes";


// const Store = window.require('electron-store');
// const store = new Store();

const router = ({ isDarkMode, setIsDarkMode }) => createBrowserRouter([
    {
        path: "/",
        element: <Main isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    }
]);

function App() {
    const [theme, setTheme] = useState('light');



    useEffect(() => {
        // Listening to the 'set-theme' event from Electron
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
        {/*<RouterProvider router={router({ isDarkMode, setIsDarkMode })} />*/}
        <Main theme={theme} />
    </Theme>
}

export default App

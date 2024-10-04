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
    const [isDarkMode, setIsDarkMode] = useState(false);

    // useEffect(() => {
    //     function onConnect() {
    //         console.log('Connected to websocket server');
    //     }
    //
    //     function onDisconnect() {
    //         console.log('Disconnected from websocket server');
    //     }
    //
    //     socket.on('connect', onConnect);
    //     socket.on('disconnect', onDisconnect);
    //     socket.on('all-rooms', (rooms) => {
    //         console.log('Rooms:', rooms);
    //     });
    //
    //     return () => {
    //         socket.off('connect', onConnect);
    //         socket.off('disconnect', onDisconnect);
    //     };
    // }, []);

    return <Theme
        appearance={isDarkMode ? 'dark' : 'light'}
        accentColor="indigo"
        panelBackground="translucent"
        radius="medium"
    >
        {/*<RouterProvider router={router({ isDarkMode, setIsDarkMode })} />*/}
        <Main isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
    </Theme>
}

export default App

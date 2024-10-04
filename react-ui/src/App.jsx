import React, {useEffect, useState} from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Main from "./views/Main/index.jsx";
import Settings from "./views/Settings/index.jsx";
import './App.css';


// const Store = window.require('electron-store');
// const store = new Store();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    }
]);

function App() {

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

    return <RouterProvider router={router}/>
}

export default App

import {useEffect, useState} from "react";
import Main from "./views/Main/index.jsx";
import './App.css';
import {Theme} from "@radix-ui/themes";
import {HashRouter, Route, Routes} from 'react-router-dom';
import CollabView from "./views/CollabView/index.jsx";


function App() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        window.electronAPI.onSetTheme((newTheme) => {
            setTheme(newTheme);
        });
    }, []);

    return <Theme
        appearance={theme}
        accentColor="indigo"
        panelBackground="translucent"
        radius="medium"
    >
        <HashRouter>
            <Routes>
                <Route exact path="/" element={<Main theme={theme}/>} />
                <Route path="/collab" element={<CollabView theme={theme}/>}>
                    <Route path=":roomID/user/:userName" element={<CollabView theme={theme}/>}/>
                    <Route path=":roomID/user/:userName/sketch/:sketchFolder" element={<CollabView theme={theme}/>}/>
                </Route>
            </Routes>
        </HashRouter>
    </Theme>
}

export default App

import React, {useEffect, useState} from "react";
import Main from "./views/Main/index.jsx";
import './App.css';
import {Theme} from "@radix-ui/themes";
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import CollabView from "./views/CollabView/CollabView.jsx";


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
        <Router>
            <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/collab" component={CollabView} />
            </Switch>
        </Router>
    </Theme>
}

export default App

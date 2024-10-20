import Main from "./views/Main/index.jsx";
import {HashRouter, Route, Routes} from 'react-router-dom';
import CollabView from "./views/CollabView/index.jsx";


function App() {
    return (
        <HashRouter>
            <Routes>
                <Route exact path="/" element={<Main />}/>
                <Route path="/theme/:theme" element={<Main />} />
                <Route path="/theme/:theme/collab" element={<CollabView />}>
                    <Route path=":roomID/user/:userName" element={<CollabView />}/>
                    <Route path=":roomID/user/:userName/sketch/:sketchFolder" element={<CollabView />}/>
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App

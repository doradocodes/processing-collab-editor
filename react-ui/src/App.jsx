// Import necessary components and libraries
import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from "./views/Main/index.jsx";
import CollabView from "./views/CollabView/index.jsx";

/**
 * App component: The root component of the application
 * 
 * This component sets up the routing structure for the entire app,
 * defining the paths and corresponding components to render.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
    return (
        <HashRouter>
            <Routes>
                {/* Main route */}
                <Route exact path="/" element={<Main />} />
                
                {/* Theme-specific main route */}
                <Route path="/theme/:theme" element={<Main />} />
                
                {/* Collaborative view routes */}
                <Route path="/theme/:theme/collab" element={<CollabView />}>
                    {/* Room and user-specific route */}
                    <Route path=":roomID/user/:userName" element={<CollabView />} />
                    
                    {/* Room, user, and sketch-specific route */}
                    <Route path=":roomID/user/:userName/sketch/:sketchFolder" element={<CollabView />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;

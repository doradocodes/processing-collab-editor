import './App.css'
import CodeMirrorComponent from "./components/CodeMirrorComponent/index.jsx";

function App() {
  return (
    <div className='App'>
        <div className="header">
            Header
        </div>
        <div className="layout">
            {/*<div className="column">*/}

            {/*</div>*/}
            <div className="column">
                <CodeMirrorComponent/>
            </div>
        </div>


    </div>
  )
}

export default App

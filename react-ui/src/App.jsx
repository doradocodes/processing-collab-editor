import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [sketchPath, setSketchPath] = useState('')

  return (
    <>
        <input type="text" value={sketchPath} onChange={(e) => setSketchPath(e.target.value)} />
        <button onClick={() => {
            window.electronAPI.runProcessing(sketchPath);
        }}>Run Processing</button>
    </>
  )
}

export default App

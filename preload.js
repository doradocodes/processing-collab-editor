const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runProcessing: (fileName, content) => ipcRenderer.invoke('run-processing', fileName, content),
    onProcessingOutput: (callback) => ipcRenderer.on('processing-output', (event, data) => callback(data))
});

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        // replaceText(`${dependency}-version`, process.versions[dependency])
        console.log(`${dependency}-version`, process.versions[dependency])
    }
})




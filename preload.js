const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    runProcessing: (fileName) => ipcRenderer.invoke('run-processing', fileName),
    stopProcessing: () => ipcRenderer.invoke('stop-processing'),
    onProcessingOutput: (callback) => ipcRenderer.on('processing-output', (event, data) => callback(data)),
    onProcessingOutputError: (callback) => ipcRenderer.on('processing-output-error', (event, data) => callback(data)),
    getSketchFolders: () => ipcRenderer.invoke('get-sketch-folders'),
    getSketchFile: (folderName) => ipcRenderer.invoke('get-sketch-file', folderName),
    createNewSketch: (folderPath, content) => ipcRenderer.invoke('create-new-sketch', folderPath, content),
    renameSketch: (oldName, newName) => ipcRenderer.invoke('rename-sketch', oldName, newName),
    deleteSketch: (folderName) => ipcRenderer.invoke('delete-sketch', folderName),
    onSetTheme: (callback) => ipcRenderer.on('set-theme', (event, theme) => callback(theme)),
    openNewWindow: (path) => ipcRenderer.invoke('open-new-window', path),
});

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
        // replaceText(`${dependency}-version`, process.versions[dependency])
        console.log(`${dependency}-version`, process.versions[dependency])
    }
})




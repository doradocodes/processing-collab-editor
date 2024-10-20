const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload script for Electron application.
 * This script runs in a separate context and can access both Node.js and browser APIs.
 */

console.log('preload.js loaded');

/**
 * Expose a set of APIs to the renderer process via contextBridge.
 * These APIs allow the renderer to communicate with the main process.
 */
contextBridge.exposeInMainWorld('electronAPI', {
    // Processing-related functions
    runProcessing: (fileName) => ipcRenderer.invoke('run-processing', fileName),
    stopProcessing: () => ipcRenderer.invoke('stop-processing'),
    onProcessingOutput: (callback) => ipcRenderer.on('processing-output', (_, data) => callback(data)),
    onProcessingOutputError: (callback) => ipcRenderer.on('processing-output-error', (_, data) => callback(data)),

    // Sketch management functions
    getSketchFolders: () => ipcRenderer.invoke('get-sketch-folders'),
    getSketchFile: (folderName) => ipcRenderer.invoke('get-sketch-file', folderName),
    createNewSketch: (folderPath, content) => ipcRenderer.invoke('create-new-sketch', folderPath, content),
    renameSketch: (oldName, newName) => ipcRenderer.invoke('rename-sketch', oldName, newName),
    deleteSketch: (folderName) => ipcRenderer.invoke('delete-sketch', folderName),

    // Theme and window management
    onSetTheme: (callback) => ipcRenderer.on('set-theme', (_, theme) => callback(theme)),
    openNewWindow: (path) => ipcRenderer.invoke('open-new-window', path),
});

/**
 * Log versions of key dependencies when the DOM content is loaded.
 */
window.addEventListener('DOMContentLoaded', () => {
    ['chrome', 'node', 'electron'].forEach(dependency => {
        console.log(`${dependency}-version: ${process.versions[dependency]}`);
    });
});

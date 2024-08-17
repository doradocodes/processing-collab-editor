// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...
    writeTempFile: (content) => ipcRenderer.invoke('write-temp-file', content),
    runProcessing: (content) => ipcRenderer.invoke('run-processing', content),
    onProcessingOutput: (callback) => ipcRenderer.on('processing-output', (event, data) => callback(data))
})

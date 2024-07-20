// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { exec } = require('child_process')
const { ipcMain } = require('electron')


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('run-processing', (event, sketchPath) => {
    return new Promise((resolve, reject) => {
        const process = exec(`processing-java --sketch=${sketchPath} --run`);

        process.stdout.on('data', (data) => {
            event.sender.send('processing-output', data.toString());
        });

        process.stderr.on('data', (data) => {
            event.sender.send('processing-output', data.toString());
        });

        process.on('close', (code) => {
            resolve(`Process exited with code ${code}`);
        });

        process.on('error', (error) => {
            reject(`error: ${error.message}`);
        });
    });
});

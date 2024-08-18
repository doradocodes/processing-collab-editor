// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const { exec } = require('child_process')
const { ipcMain } = require('electron')
const fs = require('node:fs');


const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        }
    })
    // Load your React app in production mode
    const startUrl = process.env.ELECTRON_START_URL || path.join(__dirname, '../build/index.html');
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.openDevTools();
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

const createSketchFile = (fileName, fileContent) => {
    const folderName = fileName;
    // const folderName = 'test_sketch5';
    const folderPath = path.join(__dirname + '/sketches', folderName);
    const filePath = path.join(folderPath, folderName + '.pde');
    return new Promise ((resolve, reject) => {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
            fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
            resolve(folderPath);
        } catch (error) {
            reject(error);
        }

        // fs.mkdir(folderPath, { recursive: true }, (err) => {
        //     if (err) {
        //         console.error(`Error creating folder: ${err.message}`);
        //         reject(err);
        //     }
        //
        //     console.log('Folder created successfully.');
        //
        //     // Write the file
        //     fs.writeFile(filePath, fileContent, { encoding: 'utf8' }, (err) => {
        //         if (err) {
        //             console.error(`Error writing file: ${err.message}`);
        //             reject(err);
        //         }
        //
        //         console.log('File written successfully.');
        //         resolve(folderPath);
        //     });
        // });
    });
}

ipcMain.handle('run-processing', (event, fileName, content) => {
    return new Promise((resolve, reject) => {
        createSketchFile(fileName, content).then((folderPath) => {
            console.log('Sketch created successfully', folderPath);

            const process = exec(`processing-java --sketch=${folderPath} --run`);

            process.stdout.on('data', (data) => {
                console.log('stdout:', data.toString());
                event.sender.send('processing-output', data.toString());
            });

            process.stderr.on('data', (data) => {
                console.error('stderr:', data.toString());
                event.sender.send('processing-output', data.toString());
            });

            process.on('close', (code) => {
                resolve(`Process exited with code ${code}`);
            });

            process.on('error', (error) => {
                reject(`error: ${error.message}`);
            });
        }).catch((error) => {
            console.error('Error creating sketch:', error);
            reject(error);
        });
    });
});

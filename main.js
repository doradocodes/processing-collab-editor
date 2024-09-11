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
        },
        titleBarStyle: 'hidden',
    })
    // Load your React app in production mode
    const startUrl = process.env.ELECTRON_START_URL || path.join(__dirname, '../build/index.html');
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.openDevTools();

    const secondaryWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
    });
    secondaryWindow.loadURL(startUrl);
    secondaryWindow.webContents.openDevTools();
    //
    // const thirdWindow = new BrowserWindow({
    //     width: 800,
    //     height: 600,
    //     webPreferences: {
    //         preload: path.join(__dirname, 'preload.js'),
    //         nodeIntegration: true,
    //         contextIsolation: true,
    //     }
    // });
    // thirdWindow.loadURL(startUrl);
    // thirdWindow.webContents.openDevTools();

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


const createSketchFile = (fileName, fileContent) => {
    const folderName = fileName;
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
    });
}

const getSketchFolders = () => {
    const sketchesPath = path.join(__dirname, 'sketches');
    return new Promise((resolve, reject) => {
        fs.readdir(sketchesPath, { withFileTypes: true }, (err, entries) => {
            if (err) {
                reject(err);
                return;
            }
            const folders = entries
                .filter(entry => entry.isDirectory())
                .map(dir => dir.name);
            resolve(folders);
        });
    });
};

const getSketchFile = (folderName) => {
    const folderPath = path.join(__dirname, 'sketches', folderName);
    const filePath = path.join(folderPath, folderName + '.pde');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

ipcMain.handle('get-sketch-folders', async (event) => {
    try {
        const folders = await getSketchFolders();
        return folders;
    } catch (error) {
        console.error('Error getting sketch folders:', error);
        throw error;
    }
});

ipcMain.handle('get-sketch-file', async (event, folderName) => {
    try {
        const fileContent = await getSketchFile(folderName);
        return fileContent;
    } catch (error) {
        console.error('Error getting sketch file:', error);
        throw error;
    }
});

ipcMain.handle('create-new-sketch', async (event, fileName, content) => {
    try {
        const folderPath = await createSketchFile(fileName, content);
        console.log('Sketch created successfully', folderPath);
        return folderPath;
    } catch (error) {
        console.error('Error creating sketch:', error);
        throw error
    }
});

ipcMain.handle('run-processing', (event, fileName, content) => {
    return new Promise((resolve, reject) => {
        // createSketchFile(fileName, content).then((folderPath) => {
        //     console.log('Sketch created successfully', folderPath);
        //
        //     const process = exec(`processing-java --sketch=${folderPath} --run`);
        //
        //     process.stdout.on('data', (data) => {
        //         console.log('stdout:', data.toString());
        //         event.sender.send('processing-output', data.toString());
        //     });
        //
        //     process.stderr.on('data', (data) => {
        //         console.error('stderr:', data.toString());
        //         event.sender.send('processing-output', data.toString());
        //     });
        //
        //     process.on('close', (code) => {
        //         resolve(`Process exited with code ${code}`);
        //     });
        //
        //     process.on('error', (error) => {
        //         reject(`error: ${error.message}`);
        //     });
        // }).catch((error) => {
        //     console.error('Error creating sketch:', error);
        //     reject(error);
        // });
    });
});

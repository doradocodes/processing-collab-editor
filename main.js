const { app, BrowserWindow, session, nativeImage } = require('electron')
const path = require('node:path')
const { exec } = require('child_process')
const { ipcMain } = require('electron')
const fs = require('node:fs');
const os = require('os');
// const Store = require('electron-store');

const isPackaged = app.isPackaged;
const processingJavaPath = isPackaged
    ? path.join(process.resourcesPath, 'tools', 'processing-java')
    : 'processing-java';

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing-Sketches');

if (!fs.existsSync(documentsFolderPath)) {
    fs.mkdirSync(documentsFolderPath, { recursive: true });
}

// const store = new Store();

const createWindow = () => {
    const appIcon = nativeImage.createFromPath(path.join(__dirname, 'Processing-logo.png'));

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: appIcon,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
    });



    // Load the saved theme (light or dark) and send it to the renderer process
    // const savedTheme = store.get('theme', 'light'); // Default to 'light'
    // mainWindow.webContents.on('did-finish-load', () => {
    //     mainWindow.webContents.send('set-theme', savedTheme);
    // });

    const startUrl = !isPackaged
        ? process.env.ELECTRON_START_URL
        : `file://${path.join(__dirname, 'build', 'index.html')}`;
    mainWindow.loadURL(startUrl);
    // mainWindow.webContents.openDevTools();
}

const reactDevToolsPath = path.join(
    os.homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/5.3.1_17');

const reduxDevToolsPath = path.join(
    os.homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/3.2.6_0'
);

app.whenReady().then(async () => {
    createWindow();

    // createWindow(); // Secondary test window

    // React DevTools extension
    await session.defaultSession.loadExtension(reactDevToolsPath);

    // Redux DevTools extension
    await session.defaultSession.loadExtension(reduxDevToolsPath);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const createSketchFile = (fileName, fileContent) => {
    let fn = fileName;
    let folderPath = path.join(documentsFolderPath, fileName);
    if (!fileName) {
        fn = `sketch_${new Date().getTime()}`;
        folderPath = path.join(documentsFolderPath, 'temp', fn);
    }

    const filePath = path.join(folderPath, `${fn}.pde`);

    return new Promise((resolve, reject) => {
        try {
            fs.mkdirSync(folderPath, { recursive: true });
            fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
            resolve(folderPath);
        } catch (error) {
            reject(error);
        }
    });
};

const getSketchFolders = async () => {
    try {
        const entries = await fs.promises.readdir(documentsFolderPath, { withFileTypes: true });
        const folders = entries
            .filter(entry => entry.isDirectory())
            .map(dir => dir.name);
        return folders;
    } catch (error) {
        console.error('Error getting sketch folders:', error);
        throw error;
    }
};

const getSketchFile = (folderName) => {
    const folderPath = path.join(documentsFolderPath, folderName);
    const filePath = path.join(folderPath, `${folderName}.pde`);

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
};

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
        throw error;
    }
});

ipcMain.handle('rename-sketch', async (event, oldName, newName) => {
    // rename folder and file name
    const oldFolderPath = path.join(documentsFolderPath, oldName);
    const newFolderPath = path.join(documentsFolderPath, newName);

    const oldFilePath = path.join(newFolderPath, `${oldName}.pde`);
    const newFilePath = path.join(newFolderPath, `${newName}.pde`);

    return new Promise((resolve, reject) => {
        fs.rename(oldFolderPath, newFolderPath, (error) => {
            if (error) {
                reject(error);
                return;
            }
            fs.rename(oldFilePath, newFilePath, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(newFolderPath);
            });
        });
    });
});

ipcMain.handle('run-processing', (event, folderPath) => {
    return new Promise(async (resolve, reject) => {
        console.log('Running Processing sketch:', folderPath);

        const process = exec(`${processingJavaPath} --sketch=${folderPath} --run`);

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
    });
});

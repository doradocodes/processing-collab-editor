const { app, BrowserWindow, session } = require('electron')
const path = require('node:path')
const { exec } = require('child_process')
const { ipcMain } = require('electron')
const fs = require('node:fs');
const os = require('os');

const isPackaged = app.isPackaged;
const processingJavaPath = isPackaged
    ? path.join(process.resourcesPath, 'tools', 'processing-java')
    : path.join(__dirname, 'tools', 'processing-java');

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Sketches');

if (!fs.existsSync(documentsFolderPath)) {
    fs.mkdirSync(documentsFolderPath, { recursive: true });
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
    });

    const startUrl = !isPackaged
        ? process.env.ELECTRON_START_URL
        : `file://${path.join(__dirname, 'build', 'index.html')}`;
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools();

    const secondWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
    });

    secondWindow.loadURL(startUrl);
    secondWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const createSketchFile = (fileName, fileContent) => {
    const folderPath = path.join(documentsFolderPath, fileName);  // Save in Documents
    const filePath = path.join(folderPath, `${fileName}.pde`);

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

ipcMain.handle('run-processing', (event, fileName) => {
    return new Promise(async (resolve, reject) => {
        console.log('Running Processing sketch:', fileName);
        const folderPath = path.join(documentsFolderPath, fileName);

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

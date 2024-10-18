const {app, BrowserWindow, session, nativeImage, Menu, globalShortcut} = require('electron')
const path = require('node:path')
const {exec} = require('child_process')
const {ipcMain} = require('electron')
const fs = require('node:fs');
const os = require('os');

const isDev = process.env.NODE_ENV === 'development';

const windows = [];
let theme = 'light';
const isMac = process.platform === 'darwin';
const isPackaged = app.isPackaged;
const processingJavaPath = isPackaged
    ? path.join(process.resourcesPath, 'tools', 'processing-java')
    : 'processing-java';

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');

const template = [
    {
        label: app.name,
        role: 'appMenu',
        submenu: [
            {
                label: 'About ' + app.name,
                role: 'about'
            },
            {type: 'separator'},
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'File',
        submenu: [
            {label: 'New window', accelerator: 'CmdOrCtrl+N', click: () => createMainWindow()},
            {label: 'Open', click: () => console.log('Open clicked')},
            {label: 'Save', click: () => console.log('Save clicked')},
            {type: 'separator'},
            {label: 'Exit', role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {label: 'Undo', role: 'undo'},
            {label: 'Redo', role: 'redo'},
            {type: 'separator'},
            {label: 'Cut', role: 'cut'},
            {label: 'Copy', role: 'copy'},
            {label: 'Paste', role: 'paste'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Enable Dark Mode',
                type: 'checkbox',
                checked: theme === 'dark',
                click: () => {
                    theme = theme === 'dark' ? 'light' : 'dark';
                    windows.forEach(window => {
                        window.webContents.send('set-theme', theme);
                    });
                },
            },
            {role: 'reload'},
            {role: 'toggledevtools'}
        ]
    }
];

function createSketchFolder() {
    // Attempt to write to the Documents folder
    try {
        if (!fs.existsSync(documentsFolderPath)) {
            fs.mkdirSync(documentsFolderPath, {recursive: true});
        }
        // fs.writeFileSync(testFilePath, 'Testing access to Documents folder');
        console.log('Access granted to Documents folder');
    } catch (error) {
        console.error('No permission to access Documents folder:', error);
    }
}

const createWindow = (urlPath) => {
    let options = {
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
        titleBarStyle: 'hidden',
    };
    if (BrowserWindow.getFocusedWindow()) {
        const focusedWindow = BrowserWindow.getFocusedWindow();
        const pos = focusedWindow.getPosition();
        options = {
            ...options,
            x: pos[0] + 20,
            y: pos[1] + 20,
        }
    }
    const newWindow = new BrowserWindow(options);
    windows.push(newWindow);
    const windowUrl = isDev ?
        'http://localhost:5173#/' + urlPath
        :
        `file://${path.join(__dirname, 'build', 'index.html')}#/${urlPath}`;
    newWindow.loadURL(windowUrl);
}

app.whenReady().then(async () => {
    createSketchFolder();

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);

    createWindow('');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('browser-window-focus', function () {
    // globalShortcut.register("CommandOrControl+R", () => {
    //     console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    // });
    globalShortcut.register("F5", () => {
        console.log("F5 is pressed: Shortcut Disabled");
    });
});

app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
});

app.setAboutPanelOptions({
    iconPath: '/assets/Processing-logo.png',
    applicationName: "Processing Collaborative Editor",
    applicationVersion: "App Version",
    version: "1.0",
    credits: "Dora Do",
    copyright: "Copyright"
});

/* ICP Handlers */

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

let processingProcess = null; // To store the reference to the process

ipcMain.handle('run-processing', (event, folderPath) => {
    return new Promise(async (resolve, reject) => {
        console.log('Running Processing sketch:', processingJavaPath, folderPath);

        processingProcess = exec(`"${processingJavaPath}" --sketch="${folderPath}" --run`);

        processingProcess.stdout.on('data', (data) => {
            console.log('stdout:', data.toString());
            event.sender.send('processing-output', data.toString());
        });

        processingProcess.stderr.on('data', (data) => {
            processingProcess = null;
            console.error('stderr:', data.toString());
            event.sender.send('processing-output-error', data.toString());
        });

        processingProcess.on('close', (code) => {
            processingProcess = null;
            resolve(`Process exited with code ${code}`);
        });

        processingProcess.on('error', (error) => {
            processingProcess = null;
            reject(`error: ${error.message}`);
        });
    });
});

ipcMain.handle('stop-processing', () => {
    return new Promise((resolve, reject) => {
        if (processingProcess) {
            processingProcess.kill(); // Terminate the process
            resolve('Processing sketch stopped');
            processingProcess = null; // Reset the reference after termination
        } else {
            reject('No running process to stop');
        }
    });
});

ipcMain.handle('open-new-window', (event, urlPath) => {
    createWindow(urlPath);
});


/* Utility functions */

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
            fs.mkdirSync(folderPath, {recursive: true});
            fs.writeFileSync(filePath, fileContent, {encoding: 'utf8'});
            resolve(folderPath);
        } catch (error) {
            reject(error);
        }
    });
};

const getSketchFolders = async () => {
    try {
        const entries = await fs.promises.readdir(documentsFolderPath, {withFileTypes: true});
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

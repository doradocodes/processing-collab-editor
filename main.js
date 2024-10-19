const {app, BrowserWindow, session, nativeImage, Menu, globalShortcut} = require('electron')
const path = require('node:path')
const {exec} = require('child_process')
const {ipcMain} = require('electron')
const fs = require('node:fs');
const os = require('os');
const {loadPreferences, savePreferences} = require("./preferences");

const {loadIpcFunctions} = require("./ipcUtils");


const isDev = process.env.NODE_ENV === 'development';

const windows = [];
let splashWindow = null;

const isMac = process.platform === 'darwin';

const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');

// Load initial preferences
const userPreferences = loadPreferences();

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
            {label: 'New window', accelerator: 'CmdOrCtrl+N', click: () => createWindow('')},
            // {label: 'Open', click: () => console.log('Open clicked')},
            // {label: 'Save', click: () => console.log('Save clicked')},
            {type: 'separator'},
            {label: 'Exit', role: 'quit'}
        ]
    },
    // {
    //     label: 'Edit',
    //     submenu: [
    //         {label: 'Undo', role: 'undo'},
    //         {label: 'Redo', role: 'redo'},
    //         {type: 'separator'},
    //         {label: 'Cut', role: 'cut'},
    //         {label: 'Copy', role: 'copy'},
    //         {label: 'Paste', role: 'paste'}
    //     ]
    // },
    {
        label: 'View',
        submenu: [
            {
                label: 'Enable Dark Mode',
                type: 'checkbox',
                checked: userPreferences.theme === 'dark',
                click: () => {
                    savePreferences({theme: userPreferences.theme === 'dark' ? 'light' : 'dark'});

                    // Relaunch the app
                    app.relaunch();
                    app.exit(0); // Exit the current instance with a status code of 0 (success)
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

const createWindow = (urlPath = '') => {
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
    loadWindow(newWindow, urlPath);
}

const loadWindow = (window, urlPath = '') => {
    const windowUrl = isDev ?
        `http://localhost:5173#/theme/${userPreferences.theme}/${urlPath}`
        :
        `file://${path.join(__dirname, 'build', 'index.html')}#theme/${userPreferences.theme}/${urlPath}`;
    window.loadURL(windowUrl);
    window.hide();

    window.once('ready-to-show', () => {
        if (splashWindow) {
            splashWindow.close();
            splashWindow = null;
        }
        window.show();
    });
}

const loadSplashWindow = () => {
    // Create the splash screen window
    splashWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
    });
    splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

app.whenReady().then(async () => {
    loadSplashWindow();

    createSketchFolder();

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);

    createWindow();
});

app.on('browser-window-created', () => {
})

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

loadIpcFunctions();

ipcMain.handle('open-new-window', (event, urlPath) => {
    createWindow(urlPath);
});



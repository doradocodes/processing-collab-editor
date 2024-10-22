/**
 * Main entry point for the Electron application.
 * This file sets up the main process, creates windows, and handles app lifecycle.
 */

// Import required modules
const { app, BrowserWindow, session, nativeImage, Menu, globalShortcut } = require('electron');
const path = require('node:path');
const { ipcMain } = require('electron');
const fs = require('node:fs');
const os = require('os');
const { loadPreferences, savePreferences } = require("./electronUtils/preferences");
const { loadIpcFunctions } = require("./electronUtils/ipcUtils");

// Set development mode flag
const isDev = process.env.NODE_ENV === 'development';

// Initialize window management
const windows = [];
let splashWindow = null;

// Check if running on macOS
const isMac = process.platform === 'darwin';

// Set up file paths
const documentsFolderPath = path.join(os.homedir(), 'Documents', 'Processing Collaborative Sketches');

// Load user preferences
const userPreferences = loadPreferences();

/**
 * Define menu template for the application
 * @type {Electron.MenuItemConstructorOptions[]}
 */
const template = [
    {
        label: app.name,
        role: 'appMenu',
        submenu: [
            { label: 'About ' + app.name, role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    },
    {
        label: 'File',
        submenu: [
            { label: 'New window', accelerator: 'CmdOrCtrl+N', click: () => createWindow('') },
            { type: 'separator' },
            { label: 'Exit', role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { label: 'Undo', role: 'undo' },
            { label: 'Redo', role: 'redo' },
            { type: 'separator' },
            { label: 'Cut', role: 'cut' },
            { label: 'Copy', role: 'copy' },
            { label: 'Paste', role: 'paste' }
        ]
    },
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
            { role: 'reload' },
            { role: 'toggledevtools' }
        ]
    }
];

/**
 * Creates the sketch folder in the user's Documents directory
 */
function createSketchFolder() {
    try {
        if (!fs.existsSync(documentsFolderPath)) {
            fs.mkdirSync(documentsFolderPath, { recursive: true });
        }
        console.log('Access granted to Documents folder');
    } catch (error) {
        console.error('No permission to access Documents folder:', error);
    }
}

/**
 * Creates a new application window
 * @param {string} urlPath - The URL path to load in the new window
 */
const createWindow = (urlPath = '') => {
    let options = {
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'electronUtils/preload.js'),
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

/**
 * Loads the specified URL in the given window
 * @param {Electron.BrowserWindow} window - The window to load the URL in
 * @param {string} urlPath - The URL path to load
 */
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

/**
 * Loads the splash window
 */
const loadSplashWindow = () => {
    splashWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
    });
    splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

// App ready event handler
app.whenReady().then(async () => {
    loadSplashWindow();
    createSketchFolder();
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);
    createWindow();
});

// Window creation event handler
app.on('browser-window-created', () => {
    // Add any necessary logic for new window creation
})

// Window close event handler
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Window focus event handler
app.on('browser-window-focus', function () {
    // globalShortcut.register("CommandOrControl+R", () => {
    //     console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    // });
    globalShortcut.register("F5", () => {
        console.log("F5 is pressed: Shortcut Disabled");
    });
});

// Window blur event handler
app.on('browser-window-blur', function () {
    globalShortcut.unregister('CommandOrControl+R');
    globalShortcut.unregister('F5');
});

// Set about panel options
app.setAboutPanelOptions({
    iconPath: '/assets/Processing-logo.png',
    applicationName: "Processing Collaborative Editor",
    applicationVersion: "App Version",
    version: "1.0",
    credits: "Dora Do",
    copyright: "Copyright"
});

// Load IPC functions
loadIpcFunctions();

// IPC handler for opening a new window
ipcMain.handle('open-new-window', (event, urlPath) => {
    createWindow(urlPath);
});

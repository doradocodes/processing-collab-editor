import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'fs';
import { exec } from 'child_process';

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}


function createTempName() {
  // const tempDir = os.tmpdir();
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  // const tempFilePath = path.join(tempDir, `tempfile-${uniqueSuffix}`);
  return `tempfile-${uniqueSuffix}`;
}

function writeTempFile(content) {
  const tempFileName = createTempName();
  const folderPath = path.join(os.tmpdir(), 'processing-sketches', tempFileName);
  const filePath = path.join(folderPath, `${tempFileName}.pde`);

  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err.message}`);
        reject(err);
      }

      console.log('Folder created successfully.');

      // Write the file
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error(`Error writing file: ${err.message}`);
            reject(err);
        }

        console.log('File written successfully.');
        resolve(folderPath)
      });
    });
  });
}

app.whenReady().then(createWindow)

// app.on('window-all-closed', () => {
//   win = null
//   if (process.platform !== 'darwin') app.quit()
// })
//
// app.on('second-instance', () => {
//   if (win) {
//     // Focus on the main window if the user tried to open another
//     if (win.isMinimized()) win.restore()
//     win.focus()
//   }
// })
//
// app.on('activate', () => {
//   const allWindows = BrowserWindow.getAllWindows()
//   if (allWindows.length) {
//     allWindows[0].focus()
//   } else {
//     createWindow()
//   }
// })
//
// // New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })
//
//   if (VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })

ipcMain.handle('run-processing', (event, content) => {
  return new Promise(async (resolve, reject) => {
    // const folderPath = await writeTempFile(content);

    // console.log('Running Processing sketch', '/Users/dorado/Development/pde-v2/sketch_240710b');
    const process = exec(`./processing-java --sketch=/Users/dorado/Documents/Processing/sketch_240807b --output=/Users/dorado/Development/pde-v2/Documents/Processing --force --run`);
    // const process = exec('ls')


    process.stdout.on('data', (data) => {
      console.log('data', data.toString());
      event.sender.send('processing-output', data.toString());
    });

    process.stderr.on('data', (data) => {
      console.log('Processing error', data.toString());
      event.sender.send('processing-output-err', data.toString());
    });

    process.on('close', (code) => {
      resolve(`Process exited with code ${code}`);
    });

    process.on('error', (error) => {
      console.log(error.message);
      reject(`process error: ${error.message}`);
    });
  });
});

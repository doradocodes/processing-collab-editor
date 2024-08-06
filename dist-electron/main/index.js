import { app, BrowserWindow, ipcMain, shell } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "fs";
import { exec } from "child_process";
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "../..");
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}
function createTempName() {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  return `tempfile-${uniqueSuffix}`;
}
function writeTempFile(content) {
  const tempFileName = createTempName();
  const folderPath = path.join(os.tmpdir(), "processing-sketches", tempFileName);
  const filePath = path.join(folderPath, `${tempFileName}.pde`);
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating folder: ${err.message}`);
        reject(err);
      }
      console.log("Folder created successfully.");
      fs.writeFile(filePath, content, (err2) => {
        if (err2) {
          console.error(`Error writing file: ${err2.message}`);
          reject(err2);
        }
        console.log("File written successfully.");
        resolve(folderPath);
      });
    });
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.handle("run-processing", (event, content) => {
  return new Promise(async (resolve, reject) => {
    console.log("Running Processing sketch", "/Users/dorado/Development/pde-v2/sketch_240710b");
    const process2 = exec(`processing-java --sketch=/Users/dorado/Development/pde-v2/sketch_240710b --run`);
    process2.stdout.on("data", (data) => {
      console.log("data", data.toString());
      event.sender.send("processing-output", data.toString());
    });
    process2.stderr.on("data", (data) => {
      console.log("error", data.toString());
      event.sender.send("processing-output-err", data.toString());
    });
    process2.on("close", (code) => {
      resolve(`Process exited with code ${code}`);
    });
    process2.on("error", (error) => {
      console.log("error", error.message);
      reject(`error: ${error.message}`);
    });
  });
});
ipcMain.handle("write-temp-file", (event, content) => {
  console.log("write-temp-file", content);
  const filePath = writeTempFile(content);
  console.log("write-temp-file", filePath);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=index.js.map

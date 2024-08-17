import { app as s, ipcMain as l, BrowserWindow as m, shell as g } from "electron";
import { createRequire as u } from "node:module";
import { fileURLToPath as f } from "node:url";
import n from "node:path";
import w from "node:os";
import "fs";
import { exec as P } from "child_process";
u(import.meta.url);
const c = n.dirname(f(import.meta.url));
process.env.APP_ROOT = n.join(c, "../..");
const U = n.join(process.env.APP_ROOT, "dist-electron"), a = n.join(process.env.APP_ROOT, "dist"), i = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = i ? n.join(process.env.APP_ROOT, "public") : a;
w.release().startsWith("6.1") && s.disableHardwareAcceleration();
process.platform === "win32" && s.setAppUserModelId(s.getName());
s.requestSingleInstanceLock() || (s.quit(), process.exit(0));
let o = null;
const R = n.join(c, "../preload/index.mjs"), _ = n.join(a, "index.html");
async function h() {
  o = new m({
    title: "Main window",
    icon: n.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload: R
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  }), i ? (o.loadURL(i), o.webContents.openDevTools()) : o.loadFile(_), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), o.webContents.setWindowOpenHandler(({ url: t }) => (t.startsWith("https:") && g.openExternal(t), { action: "deny" }));
}
s.whenReady().then(h);
l.handle("run-processing", (t, E) => new Promise(async (p, d) => {
  const r = P("./processing-java --sketch=/Users/dorado/Documents/Processing/sketch_240807b --output=/Users/dorado/Development/pde-v2/Documents/Processing --force --run");
  r.stdout.on("data", (e) => {
    console.log("data", e.toString()), t.sender.send("processing-output", e.toString());
  }), r.stderr.on("data", (e) => {
    console.log("Processing error", e.toString()), t.sender.send("processing-output-err", e.toString());
  }), r.on("close", (e) => {
    p(`Process exited with code ${e}`);
  }), r.on("error", (e) => {
    console.log(e.message), d(`process error: ${e.message}`);
  });
}));
export {
  U as MAIN_DIST,
  a as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};

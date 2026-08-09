const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { app, BrowserWindow, ipcMain, shell } = require("electron");

const APP_FILE = path.join(__dirname, "app.html");
const PRELOAD_FILE = path.join(__dirname, "preload.cjs");
const PROJECT_ROOT = path.join(__dirname, "..");
const execFileAsync = promisify(execFile);

async function run(command, args) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd: PROJECT_ROOT,
    windowsHide: true,
    timeout: 120000,
  });

  return `${stdout ?? ""}${stderr ?? ""}`.trim();
}

async function updateDesktopApp() {
  const steps = [];
  steps.push(await run("git", ["fetch", "github", "main"]));
  steps.push(await run("git", ["pull", "--ff-only", "github", "main"]));
  steps.push(await run("cmd.exe", ["/c", "npm.cmd", "install", "--ignore-scripts", "--no-audit", "--no-fund"]));

  return steps.filter(Boolean).join("\n");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 980,
    minHeight: 680,
    title: "Lumenary Desk Mail",
    backgroundColor: "#f6f1e8",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: PRELOAD_FILE,
      sandbox: false,
    },
  });

  win.loadFile(APP_FILE);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  ipcMain.handle("lumenary:update-app", async () => {
    try {
      const output = await updateDesktopApp();
      return { ok: true, output };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Update fehlgeschlagen",
      };
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lumenaryUpdater", {
  update: () => ipcRenderer.invoke("lumenary:update-app"),
});

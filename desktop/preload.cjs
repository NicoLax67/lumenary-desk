const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lumenaryUpdater", {
  update: () => ipcRenderer.invoke("lumenary:update-app"),
});

contextBridge.exposeInMainWorld("lumenaryMail", {
  testConnection: (account) => ipcRenderer.invoke("lumenary:mail-test", account),
  fetchInbox: (account) => ipcRenderer.invoke("lumenary:mail-fetch-inbox", account),
  sendReply: (payload) => ipcRenderer.invoke("lumenary:mail-send-reply", payload),
});

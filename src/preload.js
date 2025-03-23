// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer, ipcMain } = require('electron');

contextBridge.exposeInMainWorld('myFS', {
    writeFile: (file, content) => ipcRenderer.invoke('writeFile', file, content),
    onOpenFile: (callback) => ipcRenderer.on('open-file', (_event, filePath, contents) => callback(filePath, contents)),
});
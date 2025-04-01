// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myFS', {
    writeFile: (file, content) => ipcRenderer.invoke('writeFile', file, content),
    openFile: (filePath) => ipcRenderer.invoke('openFile', filePath),
    openFolder: (filePath) => ipcRenderer.invoke('openFolder', filePath),
    onSaveFile: (callback) => ipcRenderer.on('save-file', (_event) => callback()),
    onOpenFile: (callback) => ipcRenderer.on('open-file', (_event, filePath, contents) => callback(filePath, contents)),
    onOpenFolder: (callback) => ipcRenderer.on('open-folder', (_event, files) => callback(files)),
    onNavigateBack: (callback) => ipcRenderer.on('navigate-back', (_event) => callback()),
    onToggleMode: (callback) => ipcRenderer.on('toggle-mode', (_event) => callback())
});
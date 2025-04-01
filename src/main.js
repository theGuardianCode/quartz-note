const { app, BrowserWindow, ipcMain, Menu, dialog, globalShortcut } = require('electron');
const path = require('node:path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let fileID = 0;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  const openFolder = (filePath) => {
    const contents = fs.readdirSync(filePath, {withFileTypes: true})

    const files = [];
    for (let i = 0; i < contents.length; i++) {
      files.push({id: fileID++, name: contents[i].name, absolutePath: filePath + "\\" + contents[i].name, dir: contents[i].isDirectory()});
    }

    return files;
  };

  ipcMain.handle('openFile', (_event, filePath) => {
    if (filePath != undefined) {
      return fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        mainWindow.webContents.send('open-file', filePath, data);
      })
    }
  });

  ipcMain.handle('writeFile', (_event, file, content) => {
    fs.writeFile(file, content, (err) => {
      if (err) throw err;
    })
  });

  ipcMain.handle('openFolder', (_event, path) => {
    const files = openFolder(path);
    return files;
  });

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Folder',
          accelerator: "Ctrl+O",
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({properties: ['openDirectory']});
            if (!canceled) {
              const files = openFolder(filePaths[0]);
              mainWindow.webContents.send('open-folder', files);
            }
          },
        },
        {
          label: 'Save File',
          accelerator: 'Ctrl+S',
          click: () => {
            mainWindow.webContents.send('save-file');
          }
        },
        {
          label: 'Navigate Back',
          accelerator: 'Ctrl+Backspace',
          click: () => {
            mainWindow.webContents.send('navigate-back');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Toggle Mode',
          accelerator: 'Ctrl+T',
          click: () => {
            mainWindow.webContents.send('toggle-mode');
          }
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

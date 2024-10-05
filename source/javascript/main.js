const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '..', 'assets', 'favicon', 'favicon.ico')
  })

  win.loadFile(path.join(__dirname, '..', 'index.html'))

  win.on('maximize', () => {
    win.webContents.send('window-maximized');
  });

  win.on('unmaximize', () => {
    win.webContents.send('window-unmaximized');
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('minimize-window', () => {
  win.minimize();
});

ipcMain.on('maximize-window', () => {
  win.maximize();
});

ipcMain.on('unmaximize-window', () => {
  win.unmaximize();
});

ipcMain.on('close-window', () => {
  win.close();
});
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron/main')
const path = require('node:path')

let win;
let tray;

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

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });

  // Remove the 'close' event listener
}

function createTray() {
  tray = new Tray(path.join(__dirname, '..', 'assets', 'favicon', 'favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show', click: () => {
        win.show();
      } 
    },
    { 
      label: 'Minimize', click: () => {
        win.hide();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Close', click: () => {
        app.quit();
      } 
    }
  ]);
  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();
})

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
  win.hide();
});

ipcMain.on('maximize-window', () => {
  win.maximize();
});

ipcMain.on('unmaximize-window', () => {
  win.unmaximize();
});

ipcMain.on('close-window', () => {
  app.quit(); // Change this to quit the app instead of just closing the window
});
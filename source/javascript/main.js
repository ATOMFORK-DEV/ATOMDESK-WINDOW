const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron/main')
const path = require('node:path')

let win;
let tray;

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '..', 'assets', 'favicon', 'favicon.ico'),
    title: 'WINDOW' // Add this line to set the window title
  })

  win.loadFile(path.join(__dirname, '..', 'index.html'))

  // Set the window title again after loading the file
  win.setTitle('WINDOW')

  win.on('maximize', () => {
    win.webContents.send('window-maximized');
    console.log('maximized');
  });

  win.on('unmaximize', () => {
    win.webContents.send('window-unmaximized');
    console.log('unmaximized');
  });

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
    console.log('minimize');
  });

  // Remove the 'close' event listener
}

function createTray() {
  tray = new Tray(path.join(__dirname, '..', 'assets', 'favicon', 'favicon.ico'));
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show', click: () => {
        win.show();
        console.log('show.tray');
      } 
    },
    { 
      label: 'Minimize', click: () => {
        win.hide();
        console.log('minimize.tray');
      } 
    },
    { type: 'separator' },
    { 
      label: 'Close', click: () => {
        app.quit();
        console.log('quit.tray');
      } 
    }
  ]);
  tray.setToolTip('WINDOW');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
    console.log('click.tray');
  });
}

function createTitlebarMenu() {
  return Menu.buildFromTemplate([
    { label: 'File', submenu: [
      { label: 'New', click: () => { console.log('New file'); } },
      { label: 'Open', click: () => { console.log('Open file'); } },
      { label: 'Save', click: () => { console.log('Save file'); } },
      { type: 'separator' },
      { label: 'Exit', click: () => { app.quit(); } }
    ]},
    { label: 'Edit', submenu: [
      { label: 'Undo', role: 'undo' },
      { label: 'Redo', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', role: 'cut' },
      { label: 'Copy', role: 'copy' },
      { label: 'Paste', role: 'paste' }
    ]},
    { label: 'Help', submenu: [
      { label: 'About', click: () => { console.log('About'); } }
    ]}
  ]);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    console.log('quit');
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    console.log('activate');
  }
})

ipcMain.on('minimize-window', () => {
  win.hide();
  console.log('minimize.ipc');
});

ipcMain.on('maximize-window', () => {
  win.maximize();
  console.log('maximize.ipc');
});

ipcMain.on('unmaximize-window', () => {
  win.unmaximize();
  console.log('unmaximize.ipc');
});

ipcMain.on('close-window', () => {
  app.quit();
  console.log('close.ipc');
});

ipcMain.on('show-titlebar-context-menu', (event) => {
  const titlebarMenu = createTitlebarMenu();
  titlebarMenu.popup({ window: win });
});
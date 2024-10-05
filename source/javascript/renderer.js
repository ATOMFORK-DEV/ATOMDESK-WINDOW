const { ipcRenderer, contextBridge } = require('electron');

document.getElementById('min-button').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.getElementById('max-button').addEventListener('click', () => {
  ipcRenderer.send('maximize-window');
});

document.getElementById('restore-button').addEventListener('click', () => {
  ipcRenderer.send('unmaximize-window');
});

document.getElementById('close-button').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

// Hide the restore button by default
document.getElementById('restore-button').style.display = 'none';

// Listen for window state changes
ipcRenderer.on('window-maximized', () => {
  document.getElementById('max-button').style.display = 'none';
  document.getElementById('restore-button').style.display = 'flex';
});

ipcRenderer.on('window-unmaximized', () => {
  document.getElementById('max-button').style.display = 'flex';
  document.getElementById('restore-button').style.display = 'none';
});

// Add event listener for the titlebar icon
document.getElementById('titlebar-icon').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-titlebar-context-menu');
});

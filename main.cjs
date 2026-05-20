const { spawn } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {

  // Auto start tracker backend
  spawn(path.join(__dirname, 'tracker.exe'), [], {
    detached: true,
    stdio: 'ignore'
  });

  const win = new BrowserWindow({
    width: 1400,
    height: 900,

    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  // Load React frontend
  win.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Open DevTools (optional)
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
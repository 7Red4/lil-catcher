import { app, shell, dialog, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { getInfo, doDownloadYT, doDownloadDirect } from '../ipcMain/ytDlpCaller';
import icon from '../../resources/icon.png?asset';

let mainWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    frame: false,
    width: 820,
    height: 960,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('minimize-window', () => mainWindow.minimize && mainWindow.minimize());
ipcMain.on('toggle-window', () =>
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
);
ipcMain.on('close-window', () => {
  mainWindow.hide();
});

ipcMain.handle('call-path-picker', async () => {
  const path = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections']
  });

  return path;
});

ipcMain.handle('get-info', (event, url) => {
  return getInfo(url);
});

ipcMain.handle('start-process', (event, { processName, payload }) => {
  switch (processName) {
    case 'ytDlp:youtube':
      console.log('start-process:ytDlp:youtube');
      return doDownloadYT(payload);
    case 'ytDlp:direct':
      console.log('start-process:ytDlp:direct');
      return doDownloadDirect(payload);

    default:
      break;
  }
});

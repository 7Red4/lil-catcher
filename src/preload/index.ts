import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  toggleWindow: () => ipcRenderer.send('toggle-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  callPathPicker: () => ipcRenderer.invoke('call-path-picker'),
  getInfo: (url: string) => ipcRenderer.invoke('get-info', url)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

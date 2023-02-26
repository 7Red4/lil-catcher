import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      minimizeWindow: () => void;
      toggleWindow: () => void;
      closeWindow: () => void;

      callPathPicker: () => Electron.OpenDialogReturnValue;
      getInfo: (url: string) => VideoDetails;
    };
  }
}

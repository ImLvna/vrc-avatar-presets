import { ipcMain, shell } from 'electron'
import IPCMessage from '../../shared/ipc/enum'
import { storageDir } from '../constants'

ipcMain.handle(IPCMessage.Util_OpenDataDir, () => {
  shell.openPath(storageDir)
})

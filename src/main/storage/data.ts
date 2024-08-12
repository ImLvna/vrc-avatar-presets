import { ipcMain } from 'electron'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { mainWindow } from '..'
import IPCMessage from '../../shared/ipc/enum'
import iStorage from '../../shared/types/storage'
import { storageDir } from '../constants'
import client from '../osc/client'
import { OscMessageType } from '../osc/types'

let storage: iStorage = {
  curAvatarId: undefined,

  avatars: {}
}

export function loadData(): void {
  if (!existsSync(storageDir + '/data.json')) {
    return
  }
  const data = JSON.parse(readFileSync(storageDir + '/data.json', 'utf-8'))
  storage = data
}

export function saveData(): void {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir)
  }
  const editData = JSON.parse(JSON.stringify(storage))
  for (const avatar of Object.values(editData.avatars)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (avatar as any).parameters
  }
  const data = JSON.stringify(editData, null, 2)
  writeFileSync(storageDir + '/data.json', data)
}

export function getAvatarId(): string | undefined {
  return storage.curAvatarId
}

ipcMain.handle(IPCMessage.Data_GetAvatarId, () => {
  return storage.curAvatarId
})

export function setAvatarId(avatarId: string): void {
  if (avatarId !== undefined && !storage.avatars[avatarId]) {
    storage.avatars[avatarId] = {
      name: avatarId,
      parameters: {},
      presets: {}
    }
  }
  storage.curAvatarId = avatarId

  saveData()

  mainWindow.webContents.send(IPCMessage.Avatar_Change, avatarId)
}

ipcMain.handle(IPCMessage.Data_SetAvatarId, (_, avatarId: string) => {
  setAvatarId(avatarId)
})

export function getAvatar(avatarId: string): (typeof storage.avatars)[string] {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  return storage.avatars[avatarId]
}

ipcMain.handle(IPCMessage.Data_GetAvatar, (_, avatarId: string) => {
  return JSON.stringify(getAvatar(avatarId))
})

export function setAvatarName(avatarId: string, name: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  storage.avatars[avatarId].name = name
  saveData()
}

ipcMain.handle(IPCMessage.Data_SetAvatarName, (_, avatarId: string, name: string) => {
  setAvatarName(avatarId, name)
})

export function saveAvatarParameter(
  avatarId: string,
  parameter: string,
  value: number | boolean | null
): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  if (!storage.avatars[avatarId].parameters) {
    storage.avatars[avatarId].parameters = {}
  }
  if (value === null) {
    delete storage.avatars[avatarId].parameters[parameter]
    for (const preset of Object.values(storage.avatars[avatarId].presets)) {
      delete preset.parameters[parameter]
    }
  } else {
    storage.avatars[avatarId].parameters[parameter] = value
  }
  saveData()
}

export function createPreset(avatarId: string, name: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  const presetId = Math.random().toString(36).substring(2)
  storage.avatars[avatarId].presets[presetId] = {
    name,
    parameters: JSON.parse(JSON.stringify(storage.avatars[avatarId].parameters))
  }
  saveData()

  mainWindow.webContents.send(
    IPCMessage.Avatar_Preset_Create,
    presetId,
    JSON.stringify(storage.avatars[avatarId].presets[presetId])
  )
}

ipcMain.handle(IPCMessage.Avatar_Preset_Create, (_, avatarId: string, name: string) => {
  createPreset(avatarId, name)
})

export function deletePreset(avatarId: string, presetId: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  if (!storage.avatars[avatarId].presets[presetId]) {
    throw new Error(`Preset ${presetId} not found`)
  }
  delete storage.avatars[avatarId].presets[presetId]
  saveData()

  mainWindow.webContents.send(IPCMessage.Avatar_Preset_Delete, presetId)
}

ipcMain.handle(IPCMessage.Avatar_Preset_Delete, (_, avatarId: string, presetId: string) => {
  deletePreset(avatarId, presetId)
})

export function updatePreset(avatarId: string, presetId: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  if (!storage.avatars[avatarId].presets[presetId]) {
    throw new Error(`Preset ${presetId} not found`)
  }
  storage.avatars[avatarId].presets[presetId].parameters = Object.create(
    storage.avatars[avatarId].parameters
  )
  saveData()

  mainWindow.webContents.send(
    IPCMessage.Avatar_Preset_Update,
    presetId,
    JSON.stringify(storage.avatars[avatarId].presets[presetId])
  )
}

ipcMain.handle(IPCMessage.Avatar_Preset_Update, (_, avatarId: string, presetId: string) => {
  updatePreset(avatarId, presetId)
})

export function updatePresetName(avatarId: string, presetId: string, name: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  if (!storage.avatars[avatarId].presets[presetId]) {
    throw new Error(`Preset ${presetId} not found`)
  }
  storage.avatars[avatarId].presets[presetId].name = name
  saveData()

  mainWindow.webContents.send(IPCMessage.Avatar_Preset_Name_Update, presetId, name)
}

ipcMain.handle(
  IPCMessage.Avatar_Preset_Name_Update,
  (_, avatarId: string, presetId: string, name: string) => {
    updatePresetName(avatarId, presetId, name)
  }
)

export function loadPreset(avatarId: string, presetId: string): void {
  if (!storage.avatars[avatarId]) {
    throw new Error(`Avatar ${avatarId} not found`)
  }
  if (!storage.avatars[avatarId].presets[presetId]) {
    throw new Error(`Preset ${presetId} not found`)
  }
  for (const [parameter, value] of Object.entries(
    storage.avatars[avatarId].presets[presetId].parameters
  )) {
    storage.avatars[avatarId].parameters[parameter] = value
    client.sendMessage(OscMessageType.AvatarParameters, { parameter, value })
  }

  mainWindow.webContents.send(IPCMessage.Avatar_Preset_Load, presetId)
  saveData()
}

ipcMain.handle(IPCMessage.Avatar_Preset_Load, (_, avatarId: string, presetId: string) => {
  loadPreset(avatarId, presetId)
})

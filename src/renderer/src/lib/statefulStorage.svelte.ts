import IPCMessage from '../../../shared/ipc/enum'
import type iStorage from '../../../shared/types/storage'
import { ipcRenderer } from './ipcRenderer'

export default class Storage implements iStorage {
  curAvatarId = $state(undefined)
  curPresetId = $state(undefined)

  avatars = $state({})

  curAvatar = $derived(this.avatars[this.curAvatarId])

  presets: iStorage['avatars'][string]['presets'] = $derived(this.curAvatar?.presets || {})

  curPreset = $derived.by(() => {
    if (!this.curAvatar) return undefined
    if (!this.curPresetId) return undefined
    return this.curAvatar.presets[this.curPresetId] || undefined
  })

  makePreset = (name: string): void => {
    if (!this.curAvatar) return
    ipcRenderer.invoke(IPCMessage.Avatar_Preset_Create, this.curAvatarId, name)
  }

  loadPreset = (presetId: string): void => {
    if (!this.curAvatar) return
    ipcRenderer.invoke(IPCMessage.Avatar_Preset_Load, this.curAvatarId, presetId)
  }

  deletePreset = (presetId: string): void => {
    if (!this.curAvatar) return
    ipcRenderer.invoke(IPCMessage.Avatar_Preset_Delete, this.curAvatarId, presetId)
  }

  savePreset(presetId: string): void {
    if (!this.curAvatar) return
    ipcRenderer.invoke(IPCMessage.Avatar_Preset_Update, this.curAvatarId, presetId)
  }

  savePresetName(): void {
    if (!this.curAvatar) return
    ipcRenderer.invoke(
      IPCMessage.Avatar_Preset_Name_Update,
      this.curAvatarId,
      this.curPresetId,
      this.curPreset?.name
    )
  }

  constructor() {
    // @ts-expect-error assign to window
    window.state = this

    ipcRenderer.invoke(IPCMessage.Data_GetAvatarId).then((avatarId) => {
      this.curAvatarId = avatarId
    })

    ipcRenderer.on(IPCMessage.Avatar_Change, (_, avatarId) => {
      this.curAvatarId = avatarId
    })

    ipcRenderer.on(IPCMessage.Avatar_Preset_Create, (_, presetId, dataStr) => {
      if (!this.curAvatar) return
      this.curAvatar.presets[presetId] = JSON.parse(dataStr)
    })

    ipcRenderer.on(IPCMessage.Avatar_Preset_Delete, (_, presetId) => {
      if (!this.curAvatar) return
      delete this.curAvatar.presets[presetId]
    })

    ipcRenderer.on(IPCMessage.Avatar_Preset_Update, (_, presetId, dataStr) => {
      if (!this.curAvatar) return
      this.curAvatar.presets[presetId] = JSON.parse(dataStr)
    })

    ipcRenderer.on(IPCMessage.Avatar_Preset_Load, (_, presetId) => {
      this.curPresetId = presetId
    })

    $effect(() => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ;(async () => {
        if (this.curAvatarId && !this.curAvatar) {
          this.avatars[this.curAvatarId] = JSON.parse(
            await ipcRenderer.invoke(IPCMessage.Data_GetAvatar, this.curAvatarId)
          )
        }
      })()
    })

    $effect(() => {
      this.curAvatar?.name
      if (!this.curAvatar) return
      ipcRenderer.invoke(IPCMessage.Data_SetAvatarName, this.curAvatarId, this.curAvatar.name)
    })
  }
}

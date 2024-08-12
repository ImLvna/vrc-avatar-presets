import { Notification } from 'electron'
import { IGNORED_PARAMS } from '../constants'
import { server } from '../osc/server'
import { OscMessageType } from '../osc/types'
import { config } from './config'
import * as data from './data'

export default function initStorageHandler(): void {
  new Notification({
    title: 'What avatar are you using?',
    body: data.getAvatarId()
      ? `Last time you closed the app, you were using ${data.getAvatar(data.getAvatarId()!).name}. Is that still the case?`
      : 'Please swap avatars so we know what you are using'
  }).show()

  server.on(OscMessageType.AvatarChange, ({ avatarId }) => {
    if (!avatarId) return
    console.log(`Avatar changed to ${avatarId}`)
    if (data.getAvatarId() === undefined) {
      try {
        data.getAvatar(avatarId)
      } catch (e) {
        new Notification({
          title: 'Avatar changed',
          body: `Changed to a new avatar! Please name it in the app`
        }).show()
      }
    }
    data.setAvatarId(avatarId)
  })

  server.on(OscMessageType.AvatarParameters, ({ parameter, value }) => {
    const avatarId = data.getAvatarId()
    if (!avatarId) return
    for (const ignoredParam of [...IGNORED_PARAMS, config.ignoreParams]) {
      if (ignoredParam instanceof RegExp) {
        if (ignoredParam.test(parameter)) return
      } else if (ignoredParam === parameter) {
        return
      }
    }
    data.saveAvatarParameter(avatarId, parameter, value)
  })
}

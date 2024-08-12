export enum OscMessageType {
  AvatarChange = '/avatar/change',
  AvatarParameters = '/avatar/parameters'
}

export type OscMessageArgs = {
  [OscMessageType.AvatarChange]: {
    avatarId: string
  }
  [OscMessageType.AvatarParameters]: {
    parameter: string
    value: number | boolean
  }
}

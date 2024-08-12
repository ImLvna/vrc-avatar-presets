type iStorage = {
  curAvatarId: string | undefined
  avatars: {
    [avatarId: string]: {
      name: string
      parameters: {
        [parameter: string]: number | boolean
      }
      presets: {
        [uuid: string]: {
          name: string
          parameters: {
            [parameter: string]: number | boolean
          }
        }
      }
    }
  }
}

export default iStorage

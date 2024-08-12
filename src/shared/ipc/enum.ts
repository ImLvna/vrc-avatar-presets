enum IPCMessage {
  Data_GetAvatarId = 'data/get-avatar-id',
  Data_SetAvatarId = 'data/set-avatar-id',
  Data_GetAvatar = 'data/get-avatar',
  Data_GetAvatarPresets = 'data/get-avatar-presets',
  Data_SaveAvatarParameter = 'data/save-avatar-parameter',
  Data_SetAvatarName = 'data/set-avatar-name',

  Avatar_Change = 'avatar/change',
  Avatar_Parameter_Update = 'avatar/parameter-update',
  Avatar_Preset_Create = 'avatar/preset-create',
  Avatar_Preset_Delete = 'avatar/preset-delete',
  Avatar_Preset_Update = 'avatar/preset-update',
  Avatar_Preset_Load = 'avatar/preset-load',
  Avatar_Preset_Name_Update = 'avatar/preset-name-update',

  Util_OpenDataDir = 'util/open-data-dir'
}

export default IPCMessage

import { app } from 'electron'
import { join } from 'path'

export const IGNORED_PARAMS = [
  /^VF(\d+)_TC_current_tracking/,
  /^EyeHeightAs/,
  'Voice',
  /^Angular[XYZ]$/,
  'Viseme',
  /^Velocity[XYZ]$/,
  /^Movement[XYZ]$/,
  'VelocityMagnitude',
  'TrackingType',
  'MuteSelf',
  /^VF(\d+)_Sync*/,
  /\/LastSynced$/,
  /^VF(\d+)_Random_(Clap|Out)$/,
  /^VF(\d+)_overlappingcontactsfix$/
] as (string | RegExp)[]

export const storageDir = join(app.getPath('userData'), 'storage')

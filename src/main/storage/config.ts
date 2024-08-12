import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import RegexRegex from '../../shared/constants/regexregex'
import { iRuntimeConfig, iStoredConfig } from '../../shared/types/config'
import { storageDir } from '../constants'

export let config: iRuntimeConfig = {
  oscQuery: true,
  listenPort: 9124,
  oscQueryListenPort: 9125,
  targetHost: 'localhost:9000',
  ignoreParams: []
}

export function loadConfig(): void {
  if (!existsSync(storageDir + '/config.json')) {
    return
  }
  const data: iStoredConfig = JSON.parse(readFileSync(storageDir + '/config.json', 'utf-8'))

  const newConfig: iRuntimeConfig = data as iRuntimeConfig

  if (newConfig.ignoreParams) {
    newConfig.ignoreParams = newConfig.ignoreParams.map((param) => {
      const match = (param as string).match(RegexRegex)
      if (match) {
        return new RegExp(match[1], match[2])
      }
      return param
    })
  }
  config = newConfig
}

export function saveConfig(): void {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir)
  }
  const editConfig: iStoredConfig = Object.create(config)
  editConfig.ignoreParams = (editConfig as iRuntimeConfig).ignoreParams.map((i) => i.toString())
  const data = JSON.stringify(editConfig, null, 2)
  writeFileSync(storageDir + '/config.json', data)
}

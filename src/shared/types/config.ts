type iBaseConfig = {
  oscQuery?: boolean
  oscQueryListenPort?: number
  listenPort: number
  targetHost: string

  saveParameters?: boolean
}

export type iStoredConfig = iBaseConfig & {
  ignoreParams?: string[]
}

export type iRuntimeConfig = iBaseConfig & {
  ignoreParams: (string | RegExp)[]
}

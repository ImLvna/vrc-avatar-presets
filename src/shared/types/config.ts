type iBaseConfig = {
  oscQuery?: boolean
  oscQueryListenPort?: number
  listenPort: number
  targetHost: string
}

export type iStoredConfig = iBaseConfig & {
  ignoreParams?: string[]
}

export type iRuntimeConfig = iBaseConfig & {
  ignoreParams: (string | RegExp)[]
}

import { Server } from 'node-osc'
import { OSCQAccess, OSCQueryServer } from 'oscquery'
import { config } from '../storage/config'
import { OscMessageArgs, OscMessageType } from './types'

let server: Server

export function startOSCServer(): void {
  server = new Server(config.listenPort, '0.0.0.0', () => {
    console.log(`Listening for OSC messages on ${config.listenPort}`)
  })

  if (config.oscQuery) {
    if (!config.oscQueryListenPort) {
      throw new Error('OSCQuery requires a listen port')
    }

    const query = new OSCQueryServer({
      serviceName: 'Avatar Presets',
      oscPort: config.listenPort,
      httpPort: config.oscQueryListenPort
    })
    query.addMethod('/avatar', {
      description: 'Avatar Parameters',
      access: OSCQAccess.READWRITE
    })

    query.start()
  }

  const OscIncMessageArgs: Record<OscMessageType, OscMessageArgs[OscMessageType]> = {
    [OscMessageType.AvatarChange]: {
      avatarId: ''
    },
    [OscMessageType.AvatarParameters]: {
      parameter: '',
      value: 0
    }
  }

  server.on('message', (data) => {
    let address = data[0]
    let params = data.slice(1)

    // console.log(`Received message: ${address}`)

    // Special parsing for avatar parameters
    if (address.startsWith(OscMessageType.AvatarParameters)) {
      const value = params.pop()
      const parameter = address.replace(`${OscMessageType.AvatarParameters}/`, '')
      address = OscMessageType.AvatarParameters
      params = [parameter || '', value || 0]
    }

    // @ts-ignore Indexing by string
    if (!OscIncMessageArgs[address]) {
      // console.error(`Unknown OSC message: ${address}`)
      return
    }

    const parsedParams = params.reduce(
      (acc, param, i) => {
        // @ts-ignore Indexing by string
        acc[Object.keys(OscIncMessageArgs[address])[i]] = param
        return acc
      },
      {} as OscMessageArgs[OscMessageType]
    )

    // if (config.debug)
    // console.log(address, parsedParams)

    server.emit(address as OscMessageType, parsedParams)
  })
}

export { server }

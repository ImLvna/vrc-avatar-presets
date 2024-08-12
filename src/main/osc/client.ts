/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'node-osc'
import { config } from '../storage/config'
import { OscMessageArgs, OscMessageType } from './types'

let client: Client

export default client!

export function startOSCClient(): Client {
  const newClient = new Client(
    config.targetHost.split(':')[0],
    parseInt(config.targetHost.split(':')[1])
  )

  newClient.sendToClient = true

  // ipcMain.handle(IPCMessage.setSendToClient, (_, value) => {
  //   newClient.sendToClient = value
  // })

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  newClient.sendMessage = (addr, data, callback) => {
    if (!newClient.sendToClient) return
    let address: string = addr
    let newArgs: any[] = []

    switch (addr) {
      case OscMessageType.AvatarParameters:
        address = `${addr}/${(data as OscMessageArgs[OscMessageType.AvatarParameters]).parameter}`
        newArgs = [(data as OscMessageArgs[OscMessageType.AvatarParameters]).value]
        break

      default:
        newArgs = Object.values(data) as any
        break
    }

    if (callback) {
      newArgs.push(callback)
    }
    // if (config.debug) {
    // console.log(`Sending message: ${address}`, newArgs)
    // }
    newClient.send(address, ...(newArgs as any))
  }

  newClient._sock.on('error', (err) => {
    console.error('Client error:', err)
  })
  newClient._sock.on('close', () => {
    console.error('Client disconnected, reconnecting...')
    startOSCClient()
  })
  newClient._sock.on('connect', () => {
    console.log('Client connected')
  })
  client = newClient
  return newClient
}

import { Socket } from 'dgram'
import { OscMessageArgs, OscMessageType } from '../osc/client'

declare module 'node-osc' {
  interface Client {
    sendToClient: boolean
    _sock: Socket
    sendMessage: <T extends OscMessageType>(
      address: T,
      args: OscMessageArgs[T],
      callback?: ClientSendCallback
    ) => void
  }

  interface Server {
    on<T extends OscMessageType>(event: T, listener: (data: OscMessageArgs[T]) => void): this

    emit<T extends OscMessageType>(event: T, data: OscMessageArgs[T]): boolean
  }
}

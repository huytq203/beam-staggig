import { Client, Frame, Message } from '@stomp/stompjs'
import * as React from 'react'

export interface ISubscribeOptions {
  destination: string
  onMessage?: (message: Message) => any
  onSubscribed?: (subscription: any) => void
  headers?: {}
}

export interface IConnectOptions {
  url: string
  debug?: boolean
  headers?: object
  onError?: (error: Frame | string) => any
  heartbeat?: {
    incoming: number
    outgoing: number
  }
  onConnected?: (client: Client, frame?: Frame) => any
}

export interface ISockJsContext {
  connect: (options: IConnectOptions) => void
  disconnect: () => void
  subscribe: (options: ISubscribeOptions) => void
  unsubscribe: (subscription?: any) => void
}

export const SockJsContext = React.createContext<ISockJsContext>(
  {} as ISockJsContext,
)

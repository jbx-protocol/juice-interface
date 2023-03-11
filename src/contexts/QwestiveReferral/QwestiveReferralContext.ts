import { createContext } from 'react'

export type TInitSDK = {
  apiKey: string
  projectId: string
}

export type TQwestiveTracker = {
  isLoading: boolean
  // Here id denotes user's wallet publicKey
  setAlias?: ({ id }: { id: string }) => void
  // Here id denotes user's wallet publicKey
  setReferral?: ({ id }: { id: string }) => void
}

export type TQwestiveEmbedUI = {
  isLoading: boolean
  // Here publicKey denotes user's wallet publicKey
  setAlias?: ({ publicKey }: { publicKey: string }) => void
  openPopup?: () => void
  closePopup?: () => void
  logout?: () => void
}

export interface IQwestiveContext {
  qwestiveTracker: TQwestiveTracker
  qwestiveEmbedUI: TQwestiveEmbedUI
}

export const SDKContext = createContext<IQwestiveContext | null>(null)

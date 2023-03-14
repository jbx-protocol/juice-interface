import { createContext } from 'react'

export type TInitSDK = {
  /** API key for using the SDK */
  apiKey: string
  /** unique Id for the Juicebox project on qwestive referral platform */
  projectId: string
}

export type TQwestiveTracker = {
  /** keeps track of whether the tracker methods have been loaded or not */
  isLoading: boolean
  /** Here id denotes user's wallet publicKey, registers invitee coming juicebox with qwestive */
  setAlias?: ({ id }: { id: string }) => void
  /** Here id denotes user's wallet publicKey, registers invitee as converted user with qwestive */
  setReferral?: ({ id }: { id: string }) => void
}

export type TQwestiveEmbedUI = {
  /** keeps track of whether the embedUI methods have been loaded or not */
  isLoading: boolean
  /** Here publicKey denotes user's wallet publicKey
  logs in current user in EmbedUI when user connects wallet on Juicebox app */
  setAlias?: ({ publicKey }: { publicKey: string }) => void
  /** opens the EmbedUI popup/widget in Juicebox app */
  openPopup?: () => void
  /** closes the EmbedUI popup/widget in Juicebox app */
  closePopup?: () => void
  /** logs out the current user when user disconnect's wallet on Juicebox app */
  logout?: () => void
}

export interface IQwestiveContext {
  qwestiveTracker: TQwestiveTracker
  qwestiveEmbedUI: TQwestiveEmbedUI
}

export const SDKContext = createContext<IQwestiveContext | null>(null)

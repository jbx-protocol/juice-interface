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

interface IQwestiveContext {
  qwestiveTracker: TQwestiveTracker
}

export const SDKContext = createContext<IQwestiveContext | null>(null)

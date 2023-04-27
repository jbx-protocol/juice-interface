import { createContext } from 'react'

export type TQwestiveTracker = {
  /** keeps track of whether the tracker methods have been loaded or not */
  isLoading: boolean
  /** Here id denotes user's wallet publicKey, registers invitee coming juicebox with qwestive */
  setReferral?: (setReferralInput: { publicKey: string }) => Promise<void>
}

interface IQwestiveContext {
  qwestiveTracker: TQwestiveTracker
}

export const SDKContext = createContext<IQwestiveContext | null>(null)

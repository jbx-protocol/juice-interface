import { Web3Provider } from '@ethersproject/providers'
import { NetworkName } from 'models/network-name'
import { createContext } from 'react'

export const NetworkContext: React.Context<{
  signingProvider?: Web3Provider
  signerNetwork?: NetworkName
  usingBurnerProvider?: boolean
  onNeedProvider?: () => Promise<void>
  // TODO(odd-amphora): Fold into one.
  onNeedBlockNativeProvider?: () => void
}> = createContext({})

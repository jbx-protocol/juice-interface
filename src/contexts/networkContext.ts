import { Web3Provider } from '@ethersproject/providers'

import { NetworkName } from 'models/network-name'
import { createContext } from 'react'

export const NetworkContext: React.Context<{
  signingProvider?: Web3Provider
  signerNetwork?: NetworkName
  userAddress?: string
  onNeedProvider?: () => Promise<void>
  onSelectWallet?: () => void
  onLogOut?: () => void
}> = createContext({})

import { Web3Provider } from '@ethersproject/providers'

import { createContext } from 'react'

export const NetworkContext: React.Context<{
  signingProvider?: Web3Provider
  userAddress?: string
  shouldSwitchNetwork?: boolean
  walletIsReady?: () => Promise<boolean>
  onSelectWallet?: () => void
  onLogOut?: () => void
}> = createContext({})

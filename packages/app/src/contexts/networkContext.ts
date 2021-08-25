import { Web3Provider } from '@ethersproject/providers'
import { Account } from 'bnc-notify'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import Web3 from 'web3'

import { NetworkName } from 'models/network-name'
import { createContext } from 'react'

export const NetworkContext: React.Context<{
  signingProvider?: Web3Provider
  signerNetwork?: NetworkName
  userAddress?: string,
  onNeedProvider?: () => Promise<void>
  onSelectWallet?: () => void,
  onLogOut?: () => void,
}> = createContext({})

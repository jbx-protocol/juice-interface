import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { Transactor } from 'hooks/Transactor'
import { Contracts } from 'models/contracts'
import { NetworkName } from 'models/network-name'
import { createContext } from 'react'

export const UserContext: React.Context<{
  signingProvider?: Web3Provider
  userAddress?: string
  network?: NetworkName
  contracts?: Contracts
  transactor?: Transactor
  onNeedProvider: () => Promise<void>
  userHasProjects?: boolean
  adminFeePercent?: BigNumber
}> = createContext({
  onNeedProvider: () => Promise.resolve(),
})

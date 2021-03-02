import { Web3Provider } from '@ethersproject/providers'
import { createContext } from 'react'

import { Contracts } from 'models/contracts'
import { Transactor } from 'models/transactor'

export const UserContext: React.Context<{
  userProvider?: Web3Provider
  userAddress?: string
  contracts?: Contracts
  transactor?: Transactor
  onNeedProvider: () => Promise<void>
}> = createContext({
  onNeedProvider: () => Promise.resolve(),
})

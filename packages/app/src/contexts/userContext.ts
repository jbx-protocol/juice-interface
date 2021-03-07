import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { Budget } from 'models/budget'
import { Contracts } from 'models/contracts'
import { Transactor } from 'models/transactor'
import { createContext } from 'react'

export const UserContext: React.Context<{
  userProvider?: Web3Provider
  userAddress?: string
  contracts?: Contracts
  transactor?: Transactor
  onNeedProvider: () => Promise<void>
  currentBudget?: Budget | null
  weth?: Partial<{
    contract: Contract
    symbol: string
    address: string
  }>
}> = createContext({
  onNeedProvider: () => Promise.resolve(),
})

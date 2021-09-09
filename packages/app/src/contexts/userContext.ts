import { BigNumber } from '@ethersproject/bignumber'
import { Transactor } from 'hooks/Transactor'
import { Contracts } from 'models/contracts'
import { createContext } from 'react'

export const UserContext: React.Context<{
  contracts?: Contracts
  transactor?: Transactor
  adminFeePercent?: BigNumber
}> = createContext({})

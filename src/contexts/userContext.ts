import { Transactor } from 'hooks/transactor/Transactor'
import { Contracts } from 'models/contracts'
import { createContext } from 'react'

export const UserContext: React.Context<{
  contracts?: Contracts
  transactor?: Transactor
}> = createContext({})

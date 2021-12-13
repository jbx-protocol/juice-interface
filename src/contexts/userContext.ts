import { Transactor } from 'hooks/Transactor'
import { Contracts } from 'models/contracts'
import { createContext } from 'react'

export const UserContext: React.Context<{
  contracts?: Contracts
  transactor?: Transactor
}> = createContext({})

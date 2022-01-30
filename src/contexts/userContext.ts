import { Transactor } from 'hooks/transactor/Transactor'
import { V1Contracts } from 'models/v1/contracts'
import { createContext } from 'react'

export const UserContext: React.Context<{
  contracts?: V1Contracts
  transactor?: Transactor
}> = createContext({})

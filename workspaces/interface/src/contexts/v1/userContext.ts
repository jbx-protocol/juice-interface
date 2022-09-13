import { Transactor } from 'hooks/Transactor'
import { V1Contracts } from 'models/v1/contracts'
import { createContext } from 'react'

export const V1UserContext: React.Context<{
  contracts?: V1Contracts
  transactor?: Transactor
  version: 'v1'
}> = createContext({ version: 'v1' })

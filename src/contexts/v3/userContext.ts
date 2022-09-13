import { Transactor } from 'hooks/Transactor'
import { V3Contracts } from 'models/v3/contracts'
import { createContext } from 'react'

export const V3UserContext: React.Context<{
  contracts?: V3Contracts
  transactor?: Transactor
  version: 'v3'
}> = createContext({ version: 'v3' })

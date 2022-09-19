import { V2Contracts } from 'models/v2/contracts'
import { createContext } from 'react'

export const V2ContractsContext: React.Context<{
  contracts?: V2Contracts
}> = createContext({})

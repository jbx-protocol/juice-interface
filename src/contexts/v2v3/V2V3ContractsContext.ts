import { V2CVType, V3CVType } from 'models/cv'
import { V2V3Contracts } from 'models/v2v3/contracts'
import { createContext } from 'react'

export const V2V3ContractsContext: React.Context<{
  contracts?: V2V3Contracts
  cv?: V2CVType | V3CVType
}> = createContext({})

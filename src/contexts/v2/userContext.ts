import { Transactor } from 'hooks/Transactor'
import { V2Contracts } from 'models/v2/contracts'
import { createContext } from 'react'

export const V2UserContext: React.Context<{
  contracts?: V2Contracts
  transactor?: Transactor
}> = createContext({})

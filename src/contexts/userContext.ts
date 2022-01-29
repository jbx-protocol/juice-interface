import { Transactor } from 'hooks/transactor/Transactor'
import { JuiceboxV1Contracts } from 'models/v1/contracts'
import { createContext } from 'react'

export const UserContext: React.Context<{
  contracts?: JuiceboxV1Contracts
  transactor?: Transactor
}> = createContext({})

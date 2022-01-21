import { Transactor } from 'hooks/Transactor'
import { JuiceboxV1Contracts } from 'models/contracts/juiceboxV1'
import { createContext } from 'react'

export const UserContextV1: React.Context<{
  contracts?: JuiceboxV1Contracts
  transactor?: Transactor
}> = createContext({})

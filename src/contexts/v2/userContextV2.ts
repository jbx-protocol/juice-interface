import { Transactor } from 'hooks/Transactor'
import { JuiceboxV2Contracts } from 'models/contracts/juiceboxV2'
import { createContext } from 'react'

export const UserContextV2: React.Context<{
  contracts?: JuiceboxV2Contracts
  transactor?: Transactor
}> = createContext({})

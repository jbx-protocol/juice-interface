import { Transactor } from 'hooks/Transactor'
import { createContext } from 'react'

export const TransactionContext: React.Context<{
  transactor?: Transactor
}> = createContext({})

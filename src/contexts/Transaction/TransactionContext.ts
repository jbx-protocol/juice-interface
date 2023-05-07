import { Transactor } from 'hooks/useTransactor'
import { createContext } from 'react'

export const TransactionContext: React.Context<{
  transactor?: Transactor
}> = createContext({})

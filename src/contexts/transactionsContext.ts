import { TransactionResponse } from '@ethersproject/providers'
import { TransactionLog } from 'models/transaction'
import { createContext } from 'react'

// Prefer using tx.timestamp if tx has been mined. Otherwise use createdAt timestamp
export const timestampForTxLog = (txLog: TransactionLog) =>
  (txLog.tx as TransactionResponse).timestamp ?? txLog.createdAt

export const TransactionsContext: React.Context<{
  transactions?: TransactionLog[]
  addTransaction?: (title: string, tx: TransactionResponse) => void
  removeTransaction?: (id: number) => void
}> = createContext({})

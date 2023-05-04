import { providers } from 'ethers'
import { TransactionCallbacks, TransactionLog } from 'models/transaction'
import { createContext } from 'react'

// Prefer using tx.timestamp if tx has been mined. Otherwise use createdAt timestamp
export const timestampForTxLog = (txLog: TransactionLog) => {
  return (
    (txLog.tx as providers.TransactionResponse)?.timestamp ?? txLog.createdAt
  )
}

export type AddTransactionFunction = (
  title: string,
  tx: providers.TransactionResponse,
  callbacks?: Omit<TransactionCallbacks, 'onDone' | 'onError'>,
) => void

export const TxHistoryContext: React.Context<{
  transactions?: TransactionLog[]
  addTransaction?: AddTransactionFunction
  removeTransaction?: (id: number) => void
}> = createContext({})

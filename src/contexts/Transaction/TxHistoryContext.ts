import { JBChainId } from 'juice-sdk-react'
import { TransactionCallbacks, TxStatus } from 'models/transaction'
import { createContext } from 'react'

export type TransactionType = {
  hash: `0x${string}`
  timestamp?: number
  chainId?: JBChainId
}

export type TransactionLog = {
  id: number
  title: string
  createdAt: number
  tx: TransactionType | null
  status: TxStatus.pending | TxStatus.success | TxStatus.failed
  callbacks?: TransactionCallbacks
}

export type AddTransactionFunction = (
  title: string,
  tx: TransactionType,
  callbacks?: Omit<TransactionCallbacks, 'onDone' | 'onError'>,
) => void

export const TxHistoryContext: React.Context<{
  transactions?: TransactionLog[]
  addTransaction?: AddTransactionFunction
  removeTransaction?: (id: number) => void
}> = createContext({})

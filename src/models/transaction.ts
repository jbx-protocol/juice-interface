import { TransactionResponse } from '@ethersproject/providers'
import { Transaction } from '@ethersproject/transactions'

export enum TxStatus {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED',
}

export type TransactionLog = {
  id: number
  title: string
  createdAt: number
} & (
  | {
      // Only pending txs have not been mined
      status: TxStatus.pending
      tx: Transaction
    }
  | {
      // Once mined, tx will be a TransactionResponse
      status: TxStatus.success | TxStatus.failed
      tx: TransactionResponse
    }
)

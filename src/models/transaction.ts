import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Transaction } from '@ethersproject/transactions'

export enum TxStatus {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED',
}

export type TransactionCallback = (e?: Transaction, signer?: Signer) => void

export interface TransactionCallbacks {
  onDone?: VoidFunction
  onConfirmed?: TransactionCallback
  onCancelled?: TransactionCallback
  onError?: ErrorCallback
}

export interface TransactionOptions extends TransactionCallbacks {
  title?: string
  value?: BigNumberish
}

export type TransactionLog = {
  id: number
  title: string
  createdAt: number
  callbacks?: TransactionCallbacks
} & (
  | {
      // Only pending txs have not been mined
      status: TxStatus.pending
      tx: Transaction | null
    }
  | {
      // Once mined, tx will be a TransactionResponse
      status: TxStatus.success | TxStatus.failed
      tx: TransactionResponse | null
    }
)

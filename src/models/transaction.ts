import { ethers } from 'ethers'
import { BigintIsh } from 'utils/bigNumbers'

export enum TxStatus {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED',
}

type TransactionCallback = (
  e?: ethers.TransactionResponse,
  signer?: ethers.Signer,
) => void

export interface TransactionCallbacks {
  onDone?: VoidFunction
  onConfirmed?: TransactionCallback
  onCancelled?: TransactionCallback
  onError?: ErrorCallback
}

export interface TransactionOptions extends TransactionCallbacks {
  title?: string
  value?: BigintIsh
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
      tx: ethers.TransactionResponse | null
      block: ethers.Block | undefined
    }
  | {
      // Once mined, tx will be a TransactionResponse
      status: TxStatus.success | TxStatus.failed
      tx: ethers.TransactionResponse | null
      block: ethers.Block | undefined
    }
)

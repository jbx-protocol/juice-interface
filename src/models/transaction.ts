import { BigNumberish, Signer, Transaction } from 'ethers'

export enum TxStatus {
  pending = 'PENDING',
  success = 'SUCCESS',
  failed = 'FAILED',
}

type TransactionCallback = (e?: Transaction, signer?: Signer) => void

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


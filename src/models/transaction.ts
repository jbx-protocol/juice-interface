import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { Transaction } from '@ethersproject/transactions'

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

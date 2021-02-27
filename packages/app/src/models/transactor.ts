import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { TransactionEvent } from 'bnc-notify'

export type TransactorCallback = (
  e?: TransactionEvent,
  signer?: JsonRpcSigner,
) => void

export type TransactorOptions = {
  onDone?: VoidFunction
  onConfirmed?: TransactorCallback
  onCancelled?: TransactorCallback
}

export type Transactor = (
  contract: Contract,
  functionName: string,
  args: any[],
  options?: TransactorOptions,
) => Promise<boolean>

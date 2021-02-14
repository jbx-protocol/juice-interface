import { Deferrable } from '@ethersproject/properties'
import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers'
import { TransactionEvent } from 'bnc-notify'

export type Transactor = (
  tx: Deferrable<TransactionRequest>,
  onConfirmed?: (e: TransactionEvent, signer: JsonRpcSigner) => void,
  onCancelled?:
    | ((e: TransactionEvent, signer: JsonRpcSigner) => void)
    | boolean,
) => Promise<boolean>

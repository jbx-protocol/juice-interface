import { Deferrable } from '@ethersproject/properties'
import { JsonRpcSigner, TransactionRequest } from '@ethersproject/providers'
import { TransactionEvent } from 'bnc-notify'

export type Transactor = (
  tx: Deferrable<TransactionRequest>,
  callback?: (e: TransactionEvent, signer: JsonRpcSigner) => void,
) => Promise<boolean>

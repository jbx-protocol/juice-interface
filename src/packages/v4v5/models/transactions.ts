export interface BaseTxOpts {
  onTransactionPending: (hash?: `0x${string}`) => void
  onTransactionConfirmed: (hash?: `0x${string}`) => void
  onTransactionError: (error: Error) => void
}

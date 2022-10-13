import { GnosisSafe, GnosisSignature, SafeTransactionType } from 'models/safe'

// e.g. [ {nonce: 69}, {nonce: 45}, {nonce: 69}] returns [69, 45]
export function getUniqueNonces(transactions: SafeTransactionType[]) {
  return [
    ...new Set<number>(
      transactions?.map((tx: SafeTransactionType) => tx.nonce),
    ),
  ]
}

// returns subset of given transactions for which a given address has not signed
export function getUnsignedTxsOfUser({
  address,
  transactions,
}: {
  address: string
  transactions: SafeTransactionType[]
}) {
  const unsignedTxs: SafeTransactionType[] = []
  transactions.forEach((transaction: SafeTransactionType) => {
    let hasSigned = false
    transaction.confirmations?.forEach((confirmation: GnosisSignature) => {
      if (confirmation.owner.toLowerCase() === address) {
        hasSigned = true
      }
    })
    if (!hasSigned) unsignedTxs.push(transaction)
  })
  return unsignedTxs
}

// returns whether given wallet is member of a given Safe multisig
export function isSafeSigner({
  address,
  safe,
}: {
  address: string | undefined
  safe: GnosisSafe
}) {
  if (!address) return false
  return safe.owners.some(
    owner => owner.toLowerCase() === address.toLowerCase(),
  )
}

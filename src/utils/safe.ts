import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { isEqualAddress } from './address'

// e.g. [ {nonce: 69}, {nonce: 45}, {nonce: 69}] returns [69, 45]
export function getUniqueNonces(
  transactions: SafeTransactionType[] | undefined,
) {
  return [
    ...new Set<number>(
      transactions?.map((tx: SafeTransactionType) => tx.nonce),
    ),
  ]
}

// returns subset of given transactions for which a given address has not signed
export function getUnsignedTxsForAddress({
  address,
  transactions,
}: {
  address: string
  transactions: SafeTransactionType[] | undefined
}) {
  return transactions?.filter(
    (tx: SafeTransactionType) =>
      !tx?.confirmations?.some(confirmation =>
        isEqualAddress(confirmation.owner, address),
      ),
  )
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
  return safe.owners.some(owner => isEqualAddress(owner, address))
}

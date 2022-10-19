import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { CV2V3 } from 'models/v2v3/cv'

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
      !tx?.confirmations?.some(
        confirmation => confirmation.owner.toLowerCase() === address,
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
  return safe.owners.some(
    owner => owner.toLowerCase() === address.toLowerCase(),
  )
}

export function getTransactionVersion(
  transaction: SafeTransactionType,
): CV2V3 | undefined {
  const V2JBController = useLoadV2V3Contract({
    cv: '2',
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: '3',
    contractName: V2V3ContractName.JBController,
  })

  if (transaction.to === V2JBController?.address) {
    return '2'
  }

  if (transaction.to === V3JBController?.address) {
    return '3'
  }
}

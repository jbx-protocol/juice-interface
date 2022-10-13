import { CV_V2, CV_V3 } from 'constants/cv'
import { useLoadV2V3Contract } from 'hooks/v2v3/LoadV2V3Contract'
import { GnosisSafe, GnosisSignature, SafeTransactionType } from 'models/safe'
import { V2V3ContractName } from 'models/v2v3/contracts'

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

export function getTransactionVersion(transaction: SafeTransactionType) {
  const V2JBController = useLoadV2V3Contract({
    cv: CV_V2,
    contractName: V2V3ContractName.JBController,
  })
  const V3JBController = useLoadV2V3Contract({
    cv: CV_V3,
    contractName: V2V3ContractName.JBController,
  })

  if (transaction.to === V2JBController?.address) {
    return CV_V2
  }

  if (transaction.to === V3JBController?.address) {
    return CV_V3
  }
}

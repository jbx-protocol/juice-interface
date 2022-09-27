import { SafeTransactionType } from 'components/v2v3/V2V3Project/ProjectSafeDashboard/ProjectSafeDashboard'

// Links to a Gnosis safe multisig
export const generateSafeUrl = (address: string) =>
  `https://gnosis-safe.io/app/eth:${address}/transactions/queue`

// Links to specific transaction on Gnosis Safe app
export const generateSafeTxUrl = (transaction: SafeTransactionType) =>
  `https://gnosis-safe.io/app/eth:${transaction.safe}/transactions/multisig_${transaction.safe}_${transaction.safeTxHash}`

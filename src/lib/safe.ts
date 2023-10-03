import axios from 'axios'
import { readNetwork } from 'constants/networks'
import { SafeTransactionType } from 'models/safe'

type SafeApiParams = {
  limit?: number
  executed?: boolean
  nonce__gt?: number
  nonce__gte?: number
  nonce__lt?: number
  nonce__lte?: number
}

const SAFE_API_BASE_URL = `https://safe-transaction-${readNetwork.name}.safe.global/api/v1`
const axiosInstance = axios.create({
  baseURL: SAFE_API_BASE_URL,
})

// Links to a Gnosis safe multisig
export const generateSafeUrl = (address: string) =>
  `https://gnosis-safe.io/app/eth:${address}/transactions/queue`

// Links to specific transaction on Gnosis Safe app
export const generateSafeTxUrl = (transaction: SafeTransactionType) =>
  `https://app.safe.global/transactions/tx?safe=eth:${transaction.safe}&id=multisig_${transaction.safe}_${transaction.safeTxHash}`

export const fetchExecutedSafeTransactions = async ({
  safeAddress,
  limit,
}: {
  safeAddress: string
  limit?: number
}): Promise<SafeTransactionType[]> => {
  const safeResponse = await axiosInstance.get(`/safes/${safeAddress}`)
  const currentNonce = safeResponse.data.nonce

  const params: SafeApiParams = {
    limit,
    nonce__lt: currentNonce,
  }
  const response = await axiosInstance.get<{ results: SafeTransactionType[] }>(
    `/safes/${safeAddress}/multisig-transactions`,
    { params },
  )

  return response.data.results
}

export const fetchQueuedSafeTransactions = async ({
  safeAddress,
  limit,
}: {
  safeAddress: string
  limit?: number
}): Promise<SafeTransactionType[]> => {
  const safeResponse = await axiosInstance.get(`/safes/${safeAddress}`)
  const currentNonce = safeResponse.data.nonce

  const params: SafeApiParams = {
    limit,
    executed: false,
    nonce__gte: currentNonce,
  }

  const response = await axiosInstance.get<{ results: SafeTransactionType[] }>(
    `/safes/${safeAddress}/multisig-transactions`,
    { params },
  )

  // Ideally the Safe API would return the transactions filtered properly...
  return response.data.results.filter(
    (tx: SafeTransactionType) => tx.blockNumber === null,
  )
}

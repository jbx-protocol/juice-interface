import axios from 'axios'
import { SafeTransactionType } from 'components/v2v3/V2V3Project/ProjectSafeDashboard'
import { useQuery } from 'react-query'

const SAFE_API_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1'

const axiosInstance = axios.create({
  baseURL: SAFE_API_BASE_URL,
})

export type SafeApiParams = {
  limit?: number
  executed?: boolean
  nonce__gt?: number
  nonce__gte?: number
  nonce__lt?: number
  nonce__lte?: number
}

export function useQueuedSafeTransactions({
  safeAddress,
  limit,
}: {
  safeAddress: string | undefined
  limit?: number
}) {
  return useQuery(
    ['queued-safe-transactions', safeAddress],
    async () => {
      if (!safeAddress) return
      const safeResponse = await axiosInstance.get(`/safes/${safeAddress}`)
      const currentNonce = safeResponse.data.nonce

      const params: SafeApiParams = {
        limit,
        executed: false,
        nonce__gte: currentNonce,
      }

      const response = await axiosInstance.get(
        `/safes/${safeAddress}/multisig-transactions`,
        { params },
      )
      return response.data.results.filter(
        (tx: SafeTransactionType) => tx.safeTxGas === 0,
      )
    },
    {
      enabled: Boolean(safeAddress),
    },
  )
}

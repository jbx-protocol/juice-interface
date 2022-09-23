import axios from 'axios'
import { SafeTransactionType } from 'components/v2v3/V2V3Project/ProjectSafeDashboard'
import { useQuery } from 'react-query'

const SAFE_API_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1'

const axiosInstance = axios.create({
  baseURL: SAFE_API_BASE_URL,
})

export function useQueuedSafeTransactions({
  safeAddress,
  limit,
}: {
  safeAddress?: string
  limit?: number
}) {
  return useQuery(
    ['queued-safe-transactions', safeAddress],
    async () => {
      const response = await axiosInstance.get(
        `/safes/${safeAddress}/multisig-transactions`,
        { params: { trusted: true, limit, executed: false, queued: true } },
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

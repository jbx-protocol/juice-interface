import axios from 'axios'
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
        { params: { trusted: true, limit } },
      )

      return response.data
    },
    {
      enabled: Boolean(safeAddress),
    },
  )
}

import axios from 'axios'
import { useQuery } from 'react-query'
import { SafeApiParams } from './QueuedSafeTransactions'

const SAFE_API_BASE_URL = 'https://safe-transaction.gnosis.io/api/v1'

const axiosInstance = axios.create({
  baseURL: SAFE_API_BASE_URL,
})

export function useExecutedSafeTransactions({
  safeAddress,
  limit,
}: {
  safeAddress: string | undefined
  limit?: number
}) {
  return useQuery(
    ['executed-safe-transactions', safeAddress],
    async () => {
      if (!safeAddress) return
      const safeResponse = await axiosInstance.get(`/safes/${safeAddress}`)
      const currentNonce = safeResponse.data.nonce

      const params: SafeApiParams = {
        limit,
        nonce__lt: currentNonce,
      }
      const response = await axiosInstance.get(
        `/safes/${safeAddress}/multisig-transactions`,
        { params },
      )
      return response.data.results
    },
    {
      enabled: Boolean(safeAddress),
    },
  )
}

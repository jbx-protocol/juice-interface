import { fetchQueuedSafeTransactions } from 'lib/safe'
import { useQuery } from 'react-query'

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

      return fetchQueuedSafeTransactions({ safeAddress, limit })
    },
    {
      enabled: Boolean(safeAddress),
    },
  )
}

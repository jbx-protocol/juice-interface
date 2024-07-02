import { useQuery } from '@tanstack/react-query'
import { fetchQueuedSafeTransactions } from 'lib/safe'

export function useQueuedSafeTransactions({
  safeAddress,
  limit,
}: {
  safeAddress: string | undefined
  limit?: number
}) {
  return useQuery({
    queryKey: ['queued-safe-transactions', safeAddress],
    queryFn: async () => {
      if (!safeAddress) return

      return fetchQueuedSafeTransactions({ safeAddress, limit })
    },
    enabled: Boolean(safeAddress),
  })
}

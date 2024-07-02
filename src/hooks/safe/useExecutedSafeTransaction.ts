import { useQuery } from '@tanstack/react-query'
import { fetchExecutedSafeTransactions } from 'lib/safe'

export function useExecutedSafeTransactions({
  safeAddress,
  limit,
}: {
  safeAddress: string | undefined
  limit?: number
}) {
  return useQuery({
    queryKey: ['executed-safe-transactions', safeAddress],
    queryFn: async () => {
      if (!safeAddress) return

      return fetchExecutedSafeTransactions({ safeAddress, limit })
    },
    enabled: Boolean(safeAddress),
  })
}

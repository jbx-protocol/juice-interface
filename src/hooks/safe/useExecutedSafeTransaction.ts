import { fetchExecutedSafeTransactions } from 'lib/safe'
import { useQuery } from 'react-query'

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

      return fetchExecutedSafeTransactions({ safeAddress, limit })
    },
    {
      enabled: Boolean(safeAddress),
    },
  )
}

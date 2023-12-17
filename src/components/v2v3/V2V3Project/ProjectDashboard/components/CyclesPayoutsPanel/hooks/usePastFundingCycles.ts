import {
  FundingCycle_OrderBy,
  OrderDirection,
  useFundingCyclesQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { useMemo } from 'react'

const DEFAULT_PAGE_SIZE = 5

export function usePastFundingCycles({
  projectId,
  pageSize,
}: {
  projectId: number | undefined
  pageSize?: number
}) {
  const now = useMemo(() => Math.floor(Date.now() / 1000), [])

  return useFundingCyclesQuery({
    client,
    variables: {
      where: {
        projectId,
        endTimestamp_lt: now, // Only already ended
      },
      orderBy: FundingCycle_OrderBy.number,
      orderDirection: OrderDirection.desc,
      first: pageSize ?? DEFAULT_PAGE_SIZE,
    },
  })
}

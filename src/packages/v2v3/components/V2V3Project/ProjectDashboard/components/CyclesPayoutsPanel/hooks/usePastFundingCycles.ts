import {
  FundingCycle_OrderBy,
  OrderDirection,
  useFundingCyclesQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'

const DEFAULT_PAGE_SIZE = 5

export function usePastFundingCycles({
  projectId,
  currentFcNumber,
  pageSize,
}: {
  projectId: number | undefined
  currentFcNumber: number | undefined
  pageSize?: number
}) {
  return useFundingCyclesQuery({
    client,
    variables: {
      where: {
        projectId,
        number_lt: currentFcNumber,
      },
      orderBy: FundingCycle_OrderBy.number,
      orderDirection: OrderDirection.desc,
      first: pageSize ?? DEFAULT_PAGE_SIZE,
    },
  })
}

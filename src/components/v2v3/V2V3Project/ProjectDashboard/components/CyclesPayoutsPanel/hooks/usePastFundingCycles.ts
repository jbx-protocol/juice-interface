import {
  FundingCycle_OrderBy,
  FundingCyclesQuery,
  OrderDirection,
  useFundingCyclesQuery,
} from 'generated/graphql'

const DEFAULT_PAGE_SIZE = 5

export function usePastFundingCycles({
  projectId,
  currentFcNumber,
  pageSize,
  skip,
}: {
  projectId: number | undefined
  currentFcNumber: number | undefined
  pageSize?: number
  skip?: number
}) {
  return useFundingCyclesQuery<FundingCyclesQuery, { message: string }>(
    {
      where: {
        projectId,
        number_lt: currentFcNumber,
      },
      orderBy: FundingCycle_OrderBy.number,
      orderDirection: OrderDirection.desc,
      first: pageSize ?? DEFAULT_PAGE_SIZE,
      skip,
    },
    {},
  )
}

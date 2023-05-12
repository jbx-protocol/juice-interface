import {
  OrderDirection,
  ProjectEvent_OrderBy,
  useProjectEventsQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { PV } from 'models/pv'

export type ProjectEventFilter =
  | 'all'
  | 'addToBalanceEvent'
  | 'burnEvent'
  | 'configureEvent'
  | 'deployedERC20Event'
  | 'deployETHERC20ProjectPayerEvent'
  | 'distributePayoutsEvent'
  | 'distributeReservedTokensEvent'
  | 'mintTokensEvent'
  | 'payEvent'
  | 'printReservesEvent'
  | 'projectCreateEvent'
  | 'redeemEvent'
  | 'setFundAccessConstraintsEvent'
  | 'tapEvent'
  | 'v1ConfigureEvent'

type ProjectEventsQueryArgs = {
  filter?: ProjectEventFilter
  pv?: PV
  projectId?: number
  skip?: number
  first?: number
}

export function useProjectEvents({
  filter,
  pv,
  projectId,
  first,
  skip,
}: ProjectEventsQueryArgs) {
  return useProjectEventsQuery({
    client,
    variables: {
      first,
      skip,
      orderBy: ProjectEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
      where: {
        projectId,
        pv,
        mintTokensEvent: null,
        useAllowanceEvent: null,
        distributeToTicketModEvent: null,
        distributeToPayoutModEvent: null,
        v1InitEvent: null,
        distributeToPayoutSplitEvent: null,
        distributeToReservedTokenSplitEvent: null,
        initEvent: null,
        ...eventFilter(filter),
      },
    },
  })
}

function eventFilter(filter?: ProjectEventFilter) {
  if (!filter || filter === 'all') return {}

  return {
    [filter + '_not']: null,
  }
}

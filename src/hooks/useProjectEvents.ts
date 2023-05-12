import {
  OrderDirection,
  ProjectEvent_OrderBy,
  ProjectEventsQuery,
  useProjectEventsQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'
import { PV } from 'models/pv'

export type ProjectEventFilter =
  | 'all'
  | keyof Pick<
      ProjectEventsQuery['projectEvents'][number],
      | 'addToBalanceEvent'
      | 'burnEvent'
      | 'configureEvent'
      | 'deployedERC20Event'
      | 'deployETHERC20ProjectPayerEvent'
      | 'distributePayoutsEvent'
      | 'distributeReservedTokensEvent'
      | 'payEvent'
      | 'printReservesEvent'
      | 'projectCreateEvent'
      | 'redeemEvent'
      | 'setFundAccessConstraintsEvent'
      | 'tapEvent'
      | 'v1ConfigureEvent'
    >

type ProjectEventsQueryArgs = {
  filter?: ProjectEventFilter
  pv?: PV
  wallet?: string
  projectId?: number
  skip?: number
  first?: number
}

export function useProjectEvents({
  filter,
  pv,
  projectId,
  wallet,
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
        ...(projectId ? { projectId } : {}),
        ...(pv ? { pv } : {}),
        ...(wallet ? { wallet } : {}),
        // Always filter out projectEvents where these properties are not-null. We have no cases for showing them in the UI and don't want them to pollute the query result
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

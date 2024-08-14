import { ProjectEventsQuery } from 'generated/graphql'
import { PV } from './pv'

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

export type ProjectEventsQueryArgs = {
  filter?: ProjectEventFilter
  pv?: PV
  from?: string
  projectId?: number
  skip?: number
  first?: number
}

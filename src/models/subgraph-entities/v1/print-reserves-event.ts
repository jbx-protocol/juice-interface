import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface PrintReservesEvent extends BaseEventEntity {
  project: Project
  fundingCycleId: BigNumber
  beneficiary: string
  count: BigNumber
  beneficiaryTicketAmount: BigNumber
}

export const parsePrintReservesEventJson = (
  j: Json<PrintReservesEvent>,
): PrintReservesEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, [
    'fundingCycleId',
    'beneficiaryTicketAmount',
    'count',
  ]),
})

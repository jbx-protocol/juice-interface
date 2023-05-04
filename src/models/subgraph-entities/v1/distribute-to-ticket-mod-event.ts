import { BigNumber } from 'ethers'
import { Project } from 'models/subgraph-entities/vX/project'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { PrintReservesEvent } from './print-reserves-event'

export interface DistributeToTicketModEvent extends BaseEventEntity {
  project: Project
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modCut: BigNumber
  printReservesEvent: PrintReservesEvent
}

export const parseDistributeToTicketModEvent = (
  j: Json<DistributeToTicketModEvent>,
): DistributeToTicketModEvent => ({
  ...j,
  ...parseBigNumberKeyVals(j, ['fundingCycleId', 'projectId', 'modCut']),
  ...parseSubgraphEntitiesFromJson(j, ['project', 'printReservesEvent']),
})

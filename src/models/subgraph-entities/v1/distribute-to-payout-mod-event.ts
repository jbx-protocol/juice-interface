import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface DistributeToPayoutModEvent extends BaseEventEntity {
  project: Project
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modProjectId: number
  modAllocator: string
  modCut: BigNumber
  modCutUSD: BigNumber
  tapEvent: string
}

export const parseDistributeToPayoutModEvent = (
  j: Json<DistributeToPayoutModEvent>,
): DistributeToPayoutModEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, [
    'fundingCycleId',
    'projectId',
    'modCut',
    'modCutUSD',
  ]),
})

import { BigNumber } from 'ethers'

import { parseBigNumberKeyVal } from 'utils/graph'
import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface DistributeToReservedTokenSplitEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  tokenCount: BigNumber
  preferClaimed: boolean
  percent: number
  splitProjectId: number
  beneficiary: string
  lockedUntil: number
  allocator: string
  distributeReservedTokensEvent: string
}

export const parseDistributeToReservedTokenSplitEventJson = (
  j: Json<DistributeToReservedTokenSplitEvent>,
): DistributeToReservedTokenSplitEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVal('tokenCount', j.tokenCount),
})

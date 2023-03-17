import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface V1InitEvent extends BaseEventEntity {
  project: Project
  projectId: number

  fundingCycleId: number
  previous: number
  start: number
  weight: BigNumber
  number: number
}

export const parseV1InitEventJson = (j: Json<V1InitEvent>): V1InitEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, ['weight']),
})

import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface V1ConfigureEvent extends BaseEventEntity {
  project: Project
  projectId: number

  target: BigNumber
  currency: number
  duration: number
  cycleLimit: number
  discountRate: number
  ballot: string

  fundingCycleId: number
  reconfigured: number
  metadata: BigNumber

  version: number
  reservedRate: number
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number

  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
  extension: string
}

export const parseV1ConfigureEventJson = (
  j: Json<V1ConfigureEvent>,
): V1ConfigureEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, ['target', 'metadata']),
})

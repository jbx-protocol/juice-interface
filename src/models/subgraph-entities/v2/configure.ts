import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface ConfigureEvent extends BaseEventEntity {
  projectId: number
  project: Project
  memo: string

  duration: number
  weight: BigNumber
  discountRate: number
  ballot: string

  mustStartAtOrAfter: number
  configuration: number
  metadata: BigNumber

  setTerminalsAllowed: boolean
  setControllerAllowed: boolean
  transfersPaused: boolean

  reservedRate: number
  redemptionRate: number
  ballotRedemptionRate: number
  pausePay: boolean
  distributionsPaused: boolean
  redeemPaused: boolean
  burnPaused: boolean
  mintingAllowed: boolean
  terminalMigrationAllowed: boolean
  controllerMigrationAllowed: boolean
  shouldHoldFees: boolean
  preferClaimedTokenOverride: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean
  useDataSourceForRedeem: boolean

  dataSource: string
  metametadata: number
}

export const parseConfigureEventJson = (
  j: Json<ConfigureEvent>,
): ConfigureEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, ['weight', 'metadata']),
})

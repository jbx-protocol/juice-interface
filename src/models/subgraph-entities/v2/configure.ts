import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import { parseProjectJson, Project, ProjectJson } from '../vX/project'

export interface ConfigureEvent extends BaseEventEntity {
  projectId: number
  project: Partial<Project>

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
  payPaused: boolean
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

export type ConfigureEventJson = Partial<
  Omit<Record<keyof ConfigureEvent, string>, 'project'> &
    BaseEventEntityJson & { project: ProjectJson }
>

export const parseConfigureEventJson = (
  j: ConfigureEventJson,
): Partial<ConfigureEvent> => ({
  ...parseBaseEventEntityJson(j),
  projectId: j.projectId ? parseInt(j.projectId) : undefined,
  project: j.project ? parseProjectJson(j.project) : undefined,
  duration: j.duration ? parseInt(j.duration) : undefined,
  weight: j.weight ? BigNumber.from(j.weight) : undefined,
  discountRate: j.discountRate ? parseInt(j.discountRate) : undefined,
  ballot: j.ballot,
  mustStartAtOrAfter: j.mustStartAtOrAfter
    ? parseInt(j.mustStartAtOrAfter)
    : undefined,
  configuration: j.configuration ? parseInt(j.configuration) : undefined,
  metadata: j.metadata ? BigNumber.from(j.metadata) : undefined,
  setTerminalsAllowed:
    j.setTerminalsAllowed !== undefined ? !!j.setTerminalsAllowed : undefined,
  setControllerAllowed:
    j.setControllerAllowed !== undefined ? !!j.setControllerAllowed : undefined,
  transfersPaused:
    j.transfersPaused !== undefined ? !!j.transfersPaused : undefined,
  reservedRate: j.reservedRate ? parseInt(j.reservedRate) : undefined,
  redemptionRate: j.redemptionRate ? parseInt(j.redemptionRate) : undefined,
  ballotRedemptionRate: j.ballotRedemptionRate
    ? parseInt(j.ballotRedemptionRate)
    : undefined,
  payPaused: j.payPaused !== undefined ? !!j.payPaused : undefined,
  distributionsPaused:
    j.distributionsPaused !== undefined ? !!j.distributionsPaused : undefined,
  redeemPaused: j.redeemPaused !== undefined ? !!j.redeemPaused : undefined,
  burnPaused: j.burnPaused !== undefined ? !!j.burnPaused : undefined,
  mintingAllowed:
    j.mintingAllowed !== undefined ? !!j.mintingAllowed : undefined,
  terminalMigrationAllowed:
    j.terminalMigrationAllowed !== undefined
      ? !!j.terminalMigrationAllowed
      : undefined,
  controllerMigrationAllowed:
    j.controllerMigrationAllowed !== undefined
      ? !!j.controllerMigrationAllowed
      : undefined,
  shouldHoldFees:
    j.shouldHoldFees !== undefined ? !!j.shouldHoldFees : undefined,
  preferClaimedTokenOverride:
    j.preferClaimedTokenOverride !== undefined
      ? !!j.preferClaimedTokenOverride
      : undefined,
  useTotalOverflowForRedemptions:
    j.useTotalOverflowForRedemptions !== undefined
      ? !!j.useTotalOverflowForRedemptions
      : undefined,
  useDataSourceForPay:
    j.useDataSourceForPay !== undefined ? !!j.useDataSourceForPay : undefined,
  useDataSourceForRedeem:
    j.useDataSourceForRedeem !== undefined
      ? !!j.useDataSourceForRedeem
      : undefined,
  dataSource: j.dataSource,
  metametadata: j.metametadata ? parseInt(j.metametadata) : undefined,
})

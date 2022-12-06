import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import { parseProjectJson, Project, ProjectJson } from '../vX/project'

export interface V1ConfigureEvent extends BaseEventEntity {
  project: Partial<Project>
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

export type V1ConfigureEventJson = Partial<
  Omit<Record<keyof V1ConfigureEvent, string>, 'project'> &
    BaseEventEntityJson & { project: ProjectJson }
>

export const parseV1ConfigureEventJson = (
  j: V1ConfigureEventJson,
): Partial<V1ConfigureEvent> => ({
  ...parseBaseEventEntityJson(j),
  projectId: j.projectId !== undefined ? parseInt(j.projectId) : undefined,
  project: j.project ? parseProjectJson(j.project) : undefined,
  target: j.target ? BigNumber.from(j.target) : undefined,
  currency: j.currency !== undefined ? parseInt(j.currency) : undefined,
  duration: j.duration !== undefined ? parseInt(j.duration) : undefined,
  cycleLimit: j.cycleLimit !== undefined ? parseInt(j.cycleLimit) : undefined,
  discountRate:
    j.discountRate !== undefined ? parseInt(j.discountRate) : undefined,
  ballot: j.ballot,
  fundingCycleId:
    j.fundingCycleId !== undefined ? parseInt(j.fundingCycleId) : undefined,
  reconfigured:
    j.reconfigured !== undefined ? parseInt(j.reconfigured) : undefined,
  metadata: j.metadata ? BigNumber.from(j.metadata) : undefined,
  version: j.version !== undefined ? parseInt(j.version) : undefined,
  reservedRate:
    j.reservedRate !== undefined ? parseInt(j.reservedRate) : undefined,
  bondingCurveRate:
    j.bondingCurveRate !== undefined ? parseInt(j.bondingCurveRate) : undefined,
  reconfigurationBondingCurveRate:
    j.reconfigurationBondingCurveRate !== undefined
      ? parseInt(j.reconfigurationBondingCurveRate)
      : undefined,
  payIsPaused: j.payIsPaused !== undefined ? !!j.payIsPaused : undefined,
  ticketPrintingIsAllowed:
    j.ticketPrintingIsAllowed !== undefined
      ? !!j.ticketPrintingIsAllowed
      : undefined,
  extension: j.extension,
})

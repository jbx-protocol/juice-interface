import { BigNumber } from '@ethersproject/bignumber'

import { parseProjectJson } from 'models/subgraph-entities/vX/project'

import { Project, ProjectJson } from '../vX/project'
import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'

export interface DistributeToPayoutModEvent extends BaseEventEntity {
  project: Partial<Project>
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modProjectId: BigNumber
  modAllocator: string
  modCut: BigNumber
  tapEvent: string
}

export type DistributeToPayoutModEventJson = Partial<
  Record<Exclude<keyof DistributeToPayoutModEvent, 'project'>, string> & {
    project: ProjectJson
  } & BaseEventEntityJson
>

export const parseDistributeToPayoutModEvent = (
  j: DistributeToPayoutModEventJson,
): Partial<DistributeToPayoutModEvent> => ({
  ...parseBaseEventEntityJson(j),
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  project: j.project ? parseProjectJson(j.project) : undefined,
  projectId: j.projectId ? BigNumber.from(j.projectId) : undefined,
  modBeneficiary: j.modBeneficiary,
  modPreferUnstaked: !!j.modPreferUnstaked,
  modProjectId: j.modProjectId ? BigNumber.from(j.modProjectId) : undefined,
  modAllocator: j.modAllocator,
  modCut: j.modCut ? BigNumber.from(j.modCut) : undefined,
  tapEvent: j.tapEvent,
})

import { BigNumber } from 'ethers'

import { parseProjectJson } from 'models/subgraph-entities/project'

import { Project, ProjectJson } from './project'

export interface DistributeToPayoutModEvent {
  id: string
  project: Partial<Project>
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modProjectId: BigNumber
  modAllocator: string
  modCut: BigNumber
  caller: string
  tapEvent: string
  timestamp: number
  txHash: string
}

export type DistributeToPayoutModEventJson = Partial<
  Record<Exclude<keyof DistributeToPayoutModEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parseDistributeToPayoutModEvent = (
  json: DistributeToPayoutModEventJson,
): Partial<DistributeToPayoutModEvent> => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? parseProjectJson(json.project) : undefined,
  projectId: json.projectId ? BigNumber.from(json.projectId) : undefined,
  modProjectId: json.modProjectId
    ? BigNumber.from(json.modProjectId)
    : undefined,
  modCut: json.modCut ? BigNumber.from(json.modCut) : undefined,
  modPreferUnstaked: !!json.modPreferUnstaked,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

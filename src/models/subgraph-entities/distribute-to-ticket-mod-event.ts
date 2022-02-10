import { BigNumber } from 'ethers'
import {
  ProjectJson,
  Project,
  parseProjectJson,
} from 'models/subgraph-entities/project'

export interface DistributeToTicketModEvent {
  id: string
  project: Partial<Project>
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modCut: BigNumber
  caller: string
  printReservesEvent: string
  timestamp: number
  txHash: string
}

export type DistributeToTicketModEventJson = Partial<
  Record<Exclude<keyof DistributeToTicketModEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parseDistributeToTicketModEvent = (
  json: DistributeToTicketModEventJson,
): Partial<DistributeToTicketModEvent> => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? parseProjectJson(json.project) : undefined,
  projectId: json.projectId ? BigNumber.from(json.projectId) : undefined,
  modCut: json.modCut ? BigNumber.from(json.modCut) : undefined,
  modPreferUnstaked: !!json.modPreferUnstaked,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

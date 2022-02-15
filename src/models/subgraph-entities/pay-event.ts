import { BigNumber } from 'ethers'

import { parseProjectJson } from 'models/subgraph-entities/project'

import { Project, ProjectJson } from './project'

export interface PayEvent {
  id: string
  fundingCycleId: BigNumber
  project: Partial<Project>
  caller: string
  beneficiary: string
  amount: string
  note: string
  timestamp: number
  txHash: string
}

export type PayEventJson = Partial<
  Record<Exclude<keyof PayEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parsePayEventJson = (json: PayEventJson): Partial<PayEvent> => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? parseProjectJson(json.project) : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

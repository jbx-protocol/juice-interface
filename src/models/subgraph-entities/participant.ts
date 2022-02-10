import { BigNumber } from 'ethers'

import { parseProjectJson } from 'models/subgraph-entities/project'

import { Project, ProjectJson } from './project'

export interface Participant {
  id: string
  wallet: string
  totalPaid: BigNumber
  project: Partial<Project>
  balance: BigNumber
  stakedBalance: BigNumber
  unstakedBalance: BigNumber
  lastPaidTimestamp: number
}

export type ParticipantJson = Partial<
  Record<Exclude<keyof Participant, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parseParticipantJson = (
  json: ParticipantJson,
): Partial<Participant> => ({
  ...json,
  totalPaid: json.totalPaid ? BigNumber.from(json.totalPaid) : undefined,
  project: json.project ? parseProjectJson(json.project) : undefined,
  balance: json.balance ? BigNumber.from(json.balance) : undefined,
  stakedBalance: json.stakedBalance
    ? BigNumber.from(json.stakedBalance)
    : undefined,
  unstakedBalance: json.unstakedBalance
    ? BigNumber.from(json.unstakedBalance)
    : undefined,
  lastPaidTimestamp: json.lastPaidTimestamp
    ? parseInt(json.lastPaidTimestamp)
    : undefined,
})

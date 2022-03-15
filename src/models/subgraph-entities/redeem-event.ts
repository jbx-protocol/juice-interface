import { BigNumber } from '@ethersproject/bignumber'

import { parseProjectJson, Project, ProjectJson } from './project'

export interface RedeemEvent {
  id: string
  holder: string
  beneficiary: string
  project: Partial<Project>
  amount: BigNumber
  returnAmount: BigNumber
  caller: string
  timestamp: number
  txHash: string
}

export type RedeemEventJson = Partial<
  Record<Exclude<keyof RedeemEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parseRedeemEventJson = (
  json: RedeemEventJson,
): Partial<RedeemEvent> => ({
  ...json,
  project: json.project ? parseProjectJson(json.project) : undefined,
  amount: json.amount ? BigNumber.from(json.amount) : undefined,
  returnAmount: json.returnAmount
    ? BigNumber.from(json.returnAmount)
    : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

import { BigNumber } from 'ethers'

import { parseProjectJson, Project, ProjectJson } from './project'

export interface PrintPremineEvent {
  id: string
  project: Partial<Project>
  beneficiary: string
  amount: BigNumber
  memo: string
  caller: string
  timestamp: number
  txHash: string
}

export type PrintPremineEventJson = Partial<
  Record<Exclude<keyof PrintPremineEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parsePrintPremineEventJson = (
  json: PrintPremineEventJson,
): Partial<PrintPremineEvent> => ({
  ...json,
  project: json.project ? parseProjectJson(json.project) : undefined,
  amount: json.amount ? BigNumber.from(json.amount) : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

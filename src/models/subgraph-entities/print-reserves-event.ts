import { BigNumber } from 'ethers'

import { parseProjectJson, Project, ProjectJson } from './project'

export interface PrintReservesEvent {
  id: string
  project: Partial<Project>
  fundingCycleId: BigNumber
  beneficiary: string
  count: BigNumber
  beneficiaryTicketAmount: BigNumber
  caller: string
  timestamp: number
  txHash: string
}

export type PrintReservesEventJson = Partial<
  Record<Exclude<keyof PrintReservesEvent, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parsePrintReservesEventJson = (
  json: PrintReservesEventJson,
): Partial<PrintReservesEvent> => ({
  ...json,
  project: json.project ? parseProjectJson(json.project) : undefined,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  beneficiaryTicketAmount: json.beneficiaryTicketAmount
    ? BigNumber.from(json.beneficiaryTicketAmount)
    : undefined,
  count: json.count ? BigNumber.from(json.count) : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

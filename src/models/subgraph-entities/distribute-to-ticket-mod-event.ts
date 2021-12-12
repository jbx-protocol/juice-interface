import { BigNumber } from 'ethers'

export interface DistributeToTicketModEvent {
  id: string
  project?: BigNumber
  fundingCycleId?: BigNumber
  projectId?: BigNumber
  modBeneficiary: string
  modPreferUnstaked: boolean
  modCut?: BigNumber
  caller: string
  printReservesEvent: string
  timestamp?: number
  txHash: string
}

export type DistributeToTicketModEventJson = Record<
  keyof DistributeToTicketModEvent,
  string
>

export const parseDistributeToTicketModEvent = (
  json: DistributeToTicketModEventJson,
): DistributeToTicketModEvent => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? BigNumber.from(json.project) : undefined,
  projectId: json.projectId ? BigNumber.from(json.projectId) : undefined,
  modCut: json.modCut ? BigNumber.from(json.modCut) : undefined,
  modPreferUnstaked: !!json.modPreferUnstaked,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

import { BigNumber } from 'ethers'

export type DistributeToTicketModEvent = Partial<{
  id: string
  project: BigNumber
  fundingCycleId: BigNumber
  projectId: BigNumber
  modBeneficiary: string
  modPercent: BigNumber
  modPreferUnstaked: boolean
  modCut: BigNumber
  caller: string
  printReservesEvent: string
  timestamp: number
  txHash: string
}>

export type DistributeToTicketModEventJson = Partial<
  Record<keyof DistributeToTicketModEvent, string>
>

export const parseDistributeToTicketModEvent = (
  json: DistributeToTicketModEventJson,
): Partial<DistributeToTicketModEvent> => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? BigNumber.from(json.project) : undefined,
  projectId: json.projectId ? BigNumber.from(json.projectId) : undefined,
  modPercent: json.modPercent ? BigNumber.from(json.modPercent) : undefined,
  modCut: json.modCut ? BigNumber.from(json.modCut) : undefined,
  modPreferUnstaked: !!json.modPreferUnstaked,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

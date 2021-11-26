import { BigNumber } from 'ethers'

export interface DistributeToPayoutModEvent {
  id: string
  project?: BigNumber
  fundingCycleId?: BigNumber
  projectId?: BigNumber
  modBeneficiary: string
  modPercent?: BigNumber
  modPreferUnstaked: boolean
  modProjectId?: BigNumber
  modAllocator: string
  modCut?: BigNumber
  caller: string
  tapEvent: string
  timestamp?: number
  txHash: string
}

export type DistributeToPayoutModEventJson = Record<
  keyof DistributeToPayoutModEvent,
  string
>

export const parseDistributeToPayoutModEvent = (
  json: DistributeToPayoutModEventJson,
): DistributeToPayoutModEvent => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project ? BigNumber.from(json.project) : undefined,
  projectId: json.projectId ? BigNumber.from(json.projectId) : undefined,
  modPercent: json.modPercent ? BigNumber.from(json.modPercent) : undefined,
  modProjectId: json.modProjectId
    ? BigNumber.from(json.modProjectId)
    : undefined,
  modCut: json.modCut ? BigNumber.from(json.modCut) : undefined,
  modPreferUnstaked: !!json.modPreferUnstaked,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

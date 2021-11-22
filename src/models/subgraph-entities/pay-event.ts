import { BigNumber } from 'ethers'

export interface PayEvent {
  id?: string
  fundingCycleId?: BigNumber
  project?: BigNumber
  caller: string
  beneficiary: string
  amount: string
  note: string
  timestamp?: number
  txHash: string
}

export type PayEventJson = Record<keyof PayEvent, string> & {
  project: { id: string }
}

export const parsePayEventJson = (json: PayEventJson): PayEvent => ({
  ...json,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  project: json.project?.id ? BigNumber.from(json.project.id) : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

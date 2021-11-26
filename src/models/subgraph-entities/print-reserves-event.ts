import { BigNumber } from 'ethers'

export interface PrintReservesEvent {
  id: string
  project?: BigNumber
  fundingCycleId?: BigNumber
  beneficiary: string
  count?: BigNumber
  beneficiaryTicketAmount?: BigNumber
  caller: string
  timestamp?: number
  txHash: string
}

export type PrintReservesEventJson = Record<keyof PrintReservesEvent, string>

export const parsePrintReservesEventJson = (
  json: PrintReservesEventJson,
): PrintReservesEvent => ({
  ...json,
  project: json.project ? BigNumber.from(json.project) : undefined,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  beneficiaryTicketAmount: json.beneficiaryTicketAmount
    ? BigNumber.from(json.beneficiaryTicketAmount)
    : undefined,
  count: json.count ? BigNumber.from(json.count) : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

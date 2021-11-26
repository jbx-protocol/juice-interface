import { BigNumber } from 'ethers'

export interface TapEvent {
  id: string
  project?: BigNumber
  fundingCycleId?: BigNumber
  beneficiary: string
  amount?: BigNumber
  currency?: BigNumber
  netTransferAmount?: BigNumber
  beneficiaryTransferAmount?: BigNumber
  govFeeAmount?: BigNumber
  caller: string
  timestamp?: number
  txHash: string
}

export type TapEventJson = Record<keyof TapEvent, string>

export const parseTapEventJson = (json: TapEventJson): TapEvent => ({
  ...json,
  project: json.project ? BigNumber.from(json.project) : undefined,
  fundingCycleId: json.fundingCycleId
    ? BigNumber.from(json.fundingCycleId)
    : undefined,
  amount: json.amount ? BigNumber.from(json.amount) : undefined,
  currency: json.currency ? BigNumber.from(json.currency) : undefined,
  netTransferAmount: json.netTransferAmount
    ? BigNumber.from(json.netTransferAmount)
    : undefined,
  beneficiaryTransferAmount: json.beneficiaryTransferAmount
    ? BigNumber.from(json.beneficiaryTransferAmount)
    : undefined,
  govFeeAmount: json.govFeeAmount
    ? BigNumber.from(json.govFeeAmount)
    : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

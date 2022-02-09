import { BigNumber } from 'ethers'

import { parseProjectJson, Project, ProjectJson } from './project'

export interface TapEvent {
  id: string
  project: Partial<Project>
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  currency: BigNumber
  netTransferAmount: BigNumber
  beneficiaryTransferAmount: BigNumber
  govFeeAmount: BigNumber
  caller: string
  timestamp: number
  txHash: string
}

export type TapEventJson = Partial<
  Record<Exclude<keyof TapEvent, 'project'>, string> & { project: ProjectJson }
>

export const parseTapEventJson = (json: TapEventJson): Partial<TapEvent> => ({
  ...json,
  project: json.project ? parseProjectJson(json.project) : undefined,
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

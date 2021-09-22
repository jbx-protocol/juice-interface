import { BigNumber } from 'ethers'

export type RedeemEvent = Partial<{
  id: string
  holder: string
  beneficiary: string
  project: BigNumber
  amount: BigNumber
  returnAmount: BigNumber
  caller: string
  timestamp: number
  txHash: string
}>

export type RedeemEventJson = Partial<Record<keyof RedeemEvent, string>>

export const parseRedeemEventJson = (json: RedeemEventJson): RedeemEvent => ({
  ...json,
  project: json.project ? BigNumber.from(json.project) : undefined,
  amount: json.amount ? BigNumber.from(json.amount) : undefined,
  returnAmount: json.returnAmount
    ? BigNumber.from(json.returnAmount)
    : undefined,
  timestamp: json.timestamp ? parseInt(json.timestamp) : undefined,
})

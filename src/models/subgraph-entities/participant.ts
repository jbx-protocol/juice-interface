import { BigNumber } from 'ethers'

export interface Participant {
  id: string
  wallet: string
  totalPaid?: BigNumber
  project?: BigNumber
  balance?: BigNumber
  stakedBalance?: BigNumber
  unstakedBalance?: BigNumber
  lastPaidTimestamp?: number
}

export type ParticipantJson = Record<keyof Participant, string>

export const parseParticipantJson = (json: ParticipantJson): Participant => ({
  ...json,
  totalPaid: json.totalPaid ? BigNumber.from(json.totalPaid) : undefined,
  project: json.project ? BigNumber.from(json.project) : undefined,
  balance: json.balance ? BigNumber.from(json.balance) : undefined,
  stakedBalance: json.stakedBalance
    ? BigNumber.from(json.stakedBalance)
    : undefined,
  unstakedBalance: json.unstakedBalance
    ? BigNumber.from(json.unstakedBalance)
    : undefined,
  lastPaidTimestamp: json.lastPaidTimestamp
    ? parseInt(json.lastPaidTimestamp)
    : undefined,
})

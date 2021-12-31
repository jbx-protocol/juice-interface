import { BigNumber } from 'ethers'

export interface Participant {
  id: string
  wallet: string
  totalPaid?: BigNumber
  project?: BigNumber
  tokenBalance?: BigNumber
  lastPaidTimestamp?: number
}

export type ParticipantJson = Record<keyof Participant, string> & {
  project: { id: string }
}

export const parseParticipantJson = (json: ParticipantJson): Participant => ({
  ...json,
  totalPaid: json.totalPaid ? BigNumber.from(json.totalPaid) : undefined,
  project: json.project?.id ? BigNumber.from(json.project.id) : undefined,
  tokenBalance: json.tokenBalance
    ? BigNumber.from(json.tokenBalance)
    : undefined,
  lastPaidTimestamp: json.lastPaidTimestamp
    ? parseInt(json.lastPaidTimestamp)
    : undefined,
})

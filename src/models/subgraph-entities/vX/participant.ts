import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseProjectEntity,
  BaseProjectEntityJson,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface Participant extends BaseProjectEntity {
  wallet: string
  totalPaid: BigNumber
  balance: BigNumber
  stakedBalance: BigNumber
  unstakedBalance: BigNumber
  lastPaidTimestamp: number
}

export type ParticipantJson = Partial<
  Record<keyof Participant, string> & BaseProjectEntityJson
>

export const parseParticipantJson = (
  j: ParticipantJson,
): Partial<Participant> => ({
  ...parseBaseProjectEntityJson(j),
  wallet: j.wallet,
  totalPaid: j.totalPaid ? BigNumber.from(j.totalPaid) : undefined,
  balance: j.balance ? BigNumber.from(j.balance) : undefined,
  stakedBalance: j.stakedBalance ? BigNumber.from(j.stakedBalance) : undefined,
  unstakedBalance: j.unstakedBalance
    ? BigNumber.from(j.unstakedBalance)
    : undefined,
  lastPaidTimestamp: j.lastPaidTimestamp
    ? parseInt(j.lastPaidTimestamp)
    : undefined,
})

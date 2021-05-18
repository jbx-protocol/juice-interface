import { BigNumber } from '@ethersproject/bignumber'

export interface PayEvent {
  fundingCycleId: BigNumber
  projectId: BigNumber
  beneficiary: string
  amount: BigNumber
  note: string
  operator: string
}

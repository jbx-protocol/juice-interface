import { BigNumber } from '@ethersproject/bignumber'

export interface SustainEvent {
  amount: BigNumber
  mpId: BigNumber
  beneficiary: string
  owner: string
  sustainer: string
}

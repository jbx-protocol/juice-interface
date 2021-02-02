import { BigNumber } from '@ethersproject/bignumber'

export interface SustainEvent {
  amount: BigNumber
  budgetId: BigNumber
  beneficiary: string
  owner: string
  sustainer: string
}

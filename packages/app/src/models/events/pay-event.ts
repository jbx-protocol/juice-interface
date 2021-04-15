import { BigNumber } from '@ethersproject/bignumber'
import { CurrencyOption } from 'models/currencyOption'

export interface PayEvent {
  amount: BigNumber
  beneficiary: string
  fundingCycleId: BigNumber
  currency: CurrencyOption
  fee: BigNumber
  note: string
  payer: string
  projectId: BigNumber
}

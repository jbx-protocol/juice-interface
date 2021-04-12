import { BigNumber } from '@ethersproject/bignumber'
import { BudgetCurrency } from 'models/budget-currency'

export interface PayEvent {
  amount: BigNumber
  beneficiary: string
  budgetId: BigNumber
  currency: BudgetCurrency
  fee: BigNumber
  note: string
  payer: string
  projectId: BigNumber
}

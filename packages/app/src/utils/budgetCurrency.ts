import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BudgetCurrency } from 'models/budget-currency'

export const formatBudgetCurrency = (
  curr?: BigNumberish,
): 'ETH' | 'USD' | undefined => {
  if (!curr) return

  const str = BigNumber.from(curr).toString() as BudgetCurrency

  switch (str) {
    case '0':
      return 'ETH'
    case '1':
      return 'USD'
  }
}

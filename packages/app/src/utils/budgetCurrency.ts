import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BudgetCurrency } from 'models/budget-currency'

const budgetCurrencies: Record<
  BudgetCurrency,
  { name: string; symbol: string }
> = {
  '0': {
    name: 'WETH',
    symbol: 'Ξ',
  },
  '1': {
    name: 'USD',
    symbol: '$',
  },
}

export const budgetCurrencyName = (curr?: BigNumberish) => {
  if (!curr) return

  const str = BigNumber.from(curr).toString() as BudgetCurrency

  return budgetCurrencies[str].name
}

export const budgetCurrencySymbol = (curr?: BigNumberish) => {
  if (!curr) return

  const str = BigNumber.from(curr).toString() as BudgetCurrency

  return budgetCurrencies[str].symbol
}

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { BudgetCurrency } from 'models/budget-currency'
import { CSSProperties } from 'react'

const budgetCurrencies: Record<
  BudgetCurrency,
  { name: string; symbol: string; style?: CSSProperties }
> = {
  '0': {
    name: 'WETH',
    symbol: 'Ξ',
    style: {
      fontFamily: 'sans-serif',
    },
  },
  '1': {
    name: 'USD',
    symbol: '$',
  },
}

export const budgetCurrencyName = (curr?: BigNumberish) =>
  curr
    ? budgetCurrencies[BigNumber.from(curr).toString() as BudgetCurrency].name
    : undefined

export const budgetCurrencySymbol = (curr?: BigNumberish) =>
  curr
    ? budgetCurrencies[BigNumber.from(curr).toString() as BudgetCurrency].symbol
    : undefined

export const budgetCurrencyStyle = (curr?: BigNumberish) =>
  curr
    ? budgetCurrencies[BigNumber.from(curr).toString() as BudgetCurrency].style
    : undefined

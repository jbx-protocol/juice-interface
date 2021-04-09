import { BudgetCurrency } from 'models/budget-currency'
import React from 'react'
import { budgetCurrencyStyle, budgetCurrencySymbol } from 'utils/budgetCurrency'

export default function CurrencySymbol({
  currency,
}: {
  currency: BudgetCurrency
}) {
  return (
    <span style={budgetCurrencyStyle(currency)}>
      {budgetCurrencySymbol(currency)}
    </span>
  )
}

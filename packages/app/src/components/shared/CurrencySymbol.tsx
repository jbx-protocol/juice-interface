import { BudgetCurrency } from 'models/budget-currency'
import { CSSProperties } from 'react'
import { budgetCurrencyStyle, budgetCurrencySymbol } from 'utils/budgetCurrency'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency: BudgetCurrency
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        ...style,
        ...budgetCurrencyStyle(currency),
      }}
    >
      {budgetCurrencySymbol(currency)}
    </span>
  )
}

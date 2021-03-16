import { Input } from 'antd'
import { BudgetCurrency } from 'models/budget-currency'
import React from 'react'
import { formatBudgetCurrency } from 'utils/budgetCurrency'

import InputAccessoryButton from './InputAccessoryButton'

export default function BudgetTargetInput({
  currency,
  value,
  onValueChange,
  onCurrencyChange,
  disabled,
}: {
  currency?: BudgetCurrency
  value?: string
  onValueChange: (value: string) => void
  onCurrencyChange: (currency: BudgetCurrency) => void
  disabled?: boolean
}) {
  if (currency === undefined) return null

  const budgetCurrencySelector = (
    <InputAccessoryButton
      onClick={() => onCurrencyChange(currency)}
      text={formatBudgetCurrency(currency)}
    />
  )

  return (
    <Input
      value={value}
      className="align-end"
      placeholder="0"
      type="number"
      disabled={disabled}
      suffix={budgetCurrencySelector}
      onChange={e => onValueChange(e.target.value)}
    />
  )
}

import { Input } from 'antd'
import { colors } from 'constants/styles/colors'
import { BudgetCurrency } from 'models/budget-currency'
import React from 'react'
import { formattedBudgetCurrency } from 'utils/budgetCurrency'

export default function BudgetTargetInput({
  currency,
  target,
  onValueChange,
  onCurrencyChange,
  disabled,
}: {
  currency?: BudgetCurrency
  target?: number | string
  onValueChange: (value: number) => void
  onCurrencyChange?: VoidFunction
  disabled?: boolean
}) {
  if (currency === undefined) return null

  const budgetCurrencySelector = (
    <div
      style={{
        cursor: 'pointer',
        color: colors.secondary,
        background: colors.secondaryHint,
        fontWeight: 500,
        padding: '1px 6px',
        marginLeft: 8,
        borderRadius: 4,
      }}
      onClick={onCurrencyChange}
    >
      {formattedBudgetCurrency(currency)}
    </div>
  )

  return (
    <Input
      value={target}
      className="align-end"
      placeholder="0"
      type="number"
      disabled={disabled}
      suffix={budgetCurrencySelector}
      onChange={e => onValueChange(parseFloat(e.target.value))}
    />
  )
}

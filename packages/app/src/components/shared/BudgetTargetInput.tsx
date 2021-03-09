import { Input } from 'antd'
import { colors } from 'constants/styles/colors'
import { BudgetCurrency } from 'models/budget-currency'
import React from 'react'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import { BigNumber } from '@ethersproject/bignumber'

export default function BudgetTargetInput({
  currency,
  target,
  onValueChange,
  onCurrencyChange,
  disabled,
}: {
  currency?: BudgetCurrency
  target?: string
  onValueChange: (value: string) => void
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
      {formatBudgetCurrency(BigNumber.from(currency))}
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
      onChange={e => onValueChange(e.target.value)}
    />
  )
}

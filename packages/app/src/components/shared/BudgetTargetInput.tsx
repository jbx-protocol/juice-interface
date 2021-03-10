import { BigNumber } from '@ethersproject/bignumber'
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
  onCurrencyChange?: VoidFunction
  disabled?: boolean
}) {
  if (currency === undefined) return null

  const budgetCurrencySelector = (
    <InputAccessoryButton
      onClick={onCurrencyChange}
      text={formatBudgetCurrency(BigNumber.from(currency))}
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

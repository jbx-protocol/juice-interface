import { Form } from 'antd'
import { BudgetCurrency } from 'models/budget-currency'

import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'

export default function ProjectDuration({
  name,
  hideLabel,
  value,
  currency,
  onValueChange,
  onCurrencyChange,
  disabled,
  formItemProps,
}: {
  value: string | undefined
  onValueChange: (val: string | undefined) => void
  currency: BudgetCurrency
  onCurrencyChange: (val: BudgetCurrency) => void
  disabled?: boolean
} & FormItemExt) {
  return (
    <Form.Item
      extra="The money you need to make it happen."
      name={name}
      label={hideLabel ? undefined : 'Operating cost'}
      {...formItemProps}
    >
      <BudgetTargetInput
        value={value}
        onValueChange={onValueChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        disabled={disabled}
        placeholder="0"
      />
    </Form.Item>
  )
}

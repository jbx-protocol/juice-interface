import { Form } from 'antd'
import { CurrencyOption } from 'models/currency-option'

import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'

export default function ProjectTarget({
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
  currency: CurrencyOption
  onCurrencyChange: (val: CurrencyOption) => void
  disabled?: boolean
} & FormItemExt) {
  return (
    <Form.Item
      extra="The money you need to run your project for one funding cycle. You'll be paid in $ETH no matter the denomination currency you choose."
      name={name}
      label={hideLabel ? undefined : 'Funding target'}
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

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
  includeFee,
}: {
  value: string | undefined
  onValueChange: (val: string | undefined) => void
  currency: CurrencyOption
  onCurrencyChange: (val: CurrencyOption) => void
  disabled?: boolean
  includeFee?: boolean
} & FormItemExt) {
  return (
    <Form.Item
      extra="The maximum amount of funds that can be withdrawn from this project by the owner in one funding cycle. Funds will be withdrawn in ETH no matter the currency you choose."
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
        includeFee={includeFee}
      />
    </Form.Item>
  )
}

import { Form } from 'antd'
import { CurrencyOption } from 'models/currency-option'

import { BigNumber } from 'ethers'

import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'

export default function ProjectTarget({
  hideLabel,
  target,
  targetSubFee,
  currency,
  onTargetChange,
  onTargetSubFeeChange,
  onCurrencyChange,
  disabled,
  formItemProps,
  fee,
}: {
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (val: string | undefined) => void
  onTargetSubFeeChange: (val: string | undefined) => void
  currency: CurrencyOption
  onCurrencyChange: (val: CurrencyOption) => void
  disabled?: boolean
  fee?: BigNumber
} & FormItemExt) {
  return (
    <Form.Item
      extra="The maximum amount of funds that can be distributed from this project in one funding cycle. Funds will be withdrawn in ETH no matter the currency you choose."
      label={hideLabel ? undefined : 'Funding target'}
      {...formItemProps}
    >
      <BudgetTargetInput
        target={target}
        targetSubFee={targetSubFee}
        onChange={onTargetChange}
        onTargetSubFeeChange={onTargetSubFeeChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        disabled={disabled}
        placeholder="0"
        fee={fee}
      />
    </Form.Item>
  )
}

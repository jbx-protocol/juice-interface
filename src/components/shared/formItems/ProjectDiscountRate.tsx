import { Form } from 'antd'
import { t } from '@lingui/macro'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectDiscountRate({
  name,
  hideLabel,
  formItemProps,
  value,
  formState,
  onChange,
  disabled,
}: {
  value: string | undefined
  formState?: number
  onChange: (val?: number) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra={t`The ratio of tokens rewarded per payment amount will decrease by this percentage with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later.`}
      name={name}
      label={hideLabel ? undefined : t`Discount rate`}
      {...formItemProps}
    >
      <NumberSlider
        max={20}
        defaultValue={0}
        sliderValue={parseFloat(value ?? '0')}
        suffix="%"
        name={name}
        formState={formState}
        onChange={onChange}
        step={0.1}
        disabled={disabled}
      />
    </Form.Item>
  )
}

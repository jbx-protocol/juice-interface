import { Form } from 'antd'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectDiscountRate({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
  disabled,
}: {
  value: string | undefined
  onChange: (val?: number) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra="The ratio of tokens rewarded per payment amount will decrease by this percentage with each new funding cycle. A higher discount rate will incentivize supporters to pay your project earlier than later."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider
        max={20}
        sliderValue={parseFloat(value ?? '0')}
        suffix="%"
        name={name}
        onChange={onChange}
        step={0.1}
        disabled={disabled}
      />
    </Form.Item>
  )
}

import { Form } from 'antd'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectDiscountRate({
  name,
  hideLabel,
  formItemProps,
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (val?: number) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra="The amount of tokens rewarded per amount paid to your project will decrease by this rate with each new funding cycle. Use this to incentivize supporters to pay your project earlier than later."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider
        max={20}
        sliderValue={parseFloat(value ?? '0')}
        suffix="%"
        onChange={onChange}
        step={0.1}
      />
    </Form.Item>
  )
}

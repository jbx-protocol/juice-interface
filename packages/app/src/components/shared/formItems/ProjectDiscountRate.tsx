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
  value: number | undefined
  onChange: (val?: number) => void
} & FormItemExt) {
  console.log('projdis', value)
  return (
    <Form.Item
      extra="The discount rate determines how you'll reward earlier adopters and investors of your Juicebox. For example, if this is set to 90%, someone who pays this project in the next funding cycle will only receive 90% of the tokens per amount they would have paid in this funding cycle."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider
        min={10}
        value={value}
        suffix="%"
        onChange={onChange}
        step={0.5}
      />
    </Form.Item>
  )
}

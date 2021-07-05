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
      extra="The discount rate determines how you'll reward earlier adopters and investors of your Juicebox.
      For example, if this is set to 97%, then someone who pays 100 towards the next funding cycle will only receive 97% the amount of tokens received by someone who paid 100 towards this funding cycle."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider
        min={95}
        value={value}
        suffix="%"
        onChange={onChange}
        step={0.5}
      />
    </Form.Item>
  )
}

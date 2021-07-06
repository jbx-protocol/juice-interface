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
  return (
    <Form.Item
      extra="The discount rate determines how you'll reward early supporters of your project. For example, if this is set to 90%, someone will receive 10% more tokens if they pay this project in the current funding than if they paid the same amount in the next funding cycle."
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

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
      extra="Discount rate allows you to reward early adopters and investors of your project. For each funding cycle, the ratio of tickets rewarded per amount paid is the ratio from the previous funding cycle multiplied by this amount."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider min={95} value={value} suffix="%" onChange={onChange} />
    </Form.Item>
  )
}

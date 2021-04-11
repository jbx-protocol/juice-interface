import { Form } from 'antd'
import React from 'react'

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
      extra="The rate (95%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider min={95} value={value} suffix="%" onChange={onChange} />
    </Form.Item>
  )
}

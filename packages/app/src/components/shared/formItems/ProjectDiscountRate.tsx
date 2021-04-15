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
      // extra="The rate (90%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
      extra="This rate determines how you'd like to reward early adopters and investors of your project. For example, a 90% rate means that a payment of $10 to your project during the next payment cycle will only receive 90% the amount of Tickets received for the same $10 payment this cycle."
      name={name}
      label={hideLabel ? undefined : 'Discount rate'}
      {...formItemProps}
    >
      <NumberSlider min={95} value={value} suffix="%" onChange={onChange} />
    </Form.Item>
  )
}

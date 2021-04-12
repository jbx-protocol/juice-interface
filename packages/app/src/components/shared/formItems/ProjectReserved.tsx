import { Form } from 'antd'
import React from 'react'
import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectReserved({
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
      extra="This rate deterimes how you'll be allocated some of your project's own Tickets whenever someone pays you. For example, a 5% rate means you'll receive 5% of the total Tickets distributed for each payment made to your project – the rest will go to the payer."
      name={name}
      label={hideLabel ? undefined : 'Reserved Tickets'}
      {...formItemProps}
    >
      <NumberSlider value={value} suffix="%" onChange={onChange} />
    </Form.Item>
  )
}

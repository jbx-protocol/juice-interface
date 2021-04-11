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
      extra="The percentage of your project's overflow that you'd like to reserve for yourself. In practice, you'll just receive some of your own tickets whenever someone pays you."
      name={name}
      label={hideLabel ? undefined : 'Reserved tickets'}
      {...formItemProps}
    >
      <NumberSlider value={value} suffix="%" onChange={onChange} />
    </Form.Item>
  )
}

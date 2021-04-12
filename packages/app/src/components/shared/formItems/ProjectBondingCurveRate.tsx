import { Form } from 'antd'
import React from 'react'

import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

export default function ProjectBondingCurveRate({
  name,
  hideLabel,
  value,
  formItemProps,
  onChange,
}: {
  value: number | undefined
  onChange: (val?: number) => void
} & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Bonding curve rate'}
      extra="This rate determines the time preference you'd like your Ticket holders to have. For example, a 70% rate means that each Ticket can be redeemed for 70% of its proportional value at any given time – the rest is left to share by the Ticket hodlers. If an investor of yours owns 10% of your Ticket supply, they can redeem them for 7% of the total amount of your project's overflow"
      {...formItemProps}
    >
      <NumberSlider
        min={0}
        max={1000}
        step={1}
        value={value}
        onChange={onChange}
      />
    </Form.Item>
  )
}

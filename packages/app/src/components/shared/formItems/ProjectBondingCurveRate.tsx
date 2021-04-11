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

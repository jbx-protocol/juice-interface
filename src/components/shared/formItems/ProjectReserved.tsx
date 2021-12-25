import { Form } from 'antd'

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
      extra='Whenever someone pays your project, this percentage of tokens will be reserved and the rest will go to the payer. Reserve tokens are reserved for the project owner by default, but can also be allocated to other wallet addresses by the owner. Once tokens are reserved, anyone can "mint" them, which distributes them to their intended receivers.'
      name={name}
      label={hideLabel ? undefined : 'Reserved tokens'}
      {...formItemProps}
    >
      <NumberSlider
        sliderValue={value}
        suffix="%"
        onChange={onChange}
        name={name}
        step={0.5}
      />
    </Form.Item>
  )
}

import React from 'react'
import { Form } from 'antd'
import FormattedNumberInput from '../inputs/FormattedNumberInput'
import InputAccessoryButton from '../InputAccessoryButton'
import { FormItemExt } from './formItemExt'

export default function ProjectDuration({
  name,
  formItemProps,
  value,
  isRecurring,
  onToggleRecurring,
  onChange,
}: {
  value: string | undefined
  isRecurring: boolean | undefined
  onToggleRecurring: VoidFunction
  onChange: (val?: string) => void
} & FormItemExt) {
  return (
    <Form.Item
      extra="The life cycle of your project"
      name={name}
      {...formItemProps}
    >
      <FormattedNumberInput
        placeholder="30"
        value={value}
        suffix="days"
        accessory={
          <InputAccessoryButton
            content={isRecurring ? 'recurring' : 'one-time'}
            withArrow={true}
            onClick={onToggleRecurring}
          />
        }
        onChange={onChange}
      />
    </Form.Item>
  )
}

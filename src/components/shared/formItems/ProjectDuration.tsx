import { Form, Space, Switch } from 'antd'
import { useEffect, useState } from 'react'

import FormattedNumberInput from '../inputs/FormattedNumberInput'
import { FormItemExt } from './formItemExt'

export default function ProjectDuration({
  name,
  formItemProps,
  value,
  isRecurring,
  hideLabel,
  onToggleRecurring,
  onValueChange,
}: {
  value: string | undefined
  isRecurring: boolean | undefined
  onToggleRecurring: VoidFunction
  onValueChange: (val?: string) => void
} & FormItemExt) {
  const [showDurationInput, setShowDurationInput] = useState<boolean>()

  useEffect(() => {
    if (value && value !== '0') setShowDurationInput(true)
  }, [value])

  return (
    <div>
      <Space direction="vertical">
        <div>
          <Space>
            <Switch
              checked={showDurationInput}
              onChange={checked => {
                setShowDurationInput(checked)
                onValueChange(checked ? '30' : '0')

                // If toggling off Funding Cycle Duration when set to "one-time", revert it to "recurring"
                if (!isRecurring && !checked) {
                  onToggleRecurring()
                }
              }}
            />
            <label>Set a funding cycle duration</label>
          </Space>
        </div>

        <Form.Item
          extra="How long one funding cycle will last. Changes to upcoming funding cycles will only take effect once the current cycle has ended."
          name={name}
          label={hideLabel ? undefined : 'Funding cycle duration'}
          {...formItemProps}
          style={{ display: showDurationInput ? 'block' : 'none' }}
        >
          <FormattedNumberInput
            placeholder="30"
            value={value}
            suffix="days"
            onChange={onValueChange}
            min={1}
            // Disabled toggle for recurring/one-time
            //
            // accessory={
            //   <InputAccessoryButton
            //     content={isRecurring ? 'recurring' : 'one-time'}
            //     withArrow={true}
            //     onClick={onToggleRecurring}
            //   />
            // }
          />
        </Form.Item>
      </Space>
    </div>
  )
}

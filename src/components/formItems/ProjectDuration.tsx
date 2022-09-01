import { t, Trans } from '@lingui/macro'
import { Form, Space, Switch } from 'antd'
import { SwitchChangeEventHandler } from 'antd/lib/switch'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { useCallback, useEffect, useState } from 'react'
import { FormItemExt } from './formItemExt'

const DurationSwitch = ({
  checked,
  onChange,
}: { checked?: boolean; onChange?: SwitchChangeEventHandler } = {}) => {
  return (
    <Space>
      <Switch checked={checked} onChange={onChange} />
      <label>
        <Trans>Set a funding cycle duration</Trans>
      </label>
    </Space>
  )
}

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

  const handleDurationSwitchChanged = useCallback<SwitchChangeEventHandler>(
    checked => {
      setShowDurationInput(checked)
      onValueChange(checked ? '30' : '0')

      // If toggling off Funding Cycle Duration when set to "one-time", revert it to "recurring"
      if (!isRecurring && !checked) {
        onToggleRecurring()
      }
    },
    [isRecurring, onToggleRecurring, onValueChange],
  )

  useEffect(() => {
    if (value && value !== '0') setShowDurationInput(true)
  }, [value])

  return (
    <Space direction="vertical">
      <DurationSwitch
        checked={showDurationInput}
        onChange={handleDurationSwitchChanged}
      />

      <Form.Item
        extra={
          <p>
            <Trans>
              How long one funding cycle will last. Funding cycle{' '}
              <strong>reconfigurations</strong> will only take effect for{' '}
              <strong>upcoming</strong> funding cycles, i.e. once a current
              funding cycle has ended.
            </Trans>
          </p>
        }
        name={name}
        label={hideLabel ? undefined : t`Funding cycle duration`}
        {...formItemProps}
        style={{ display: showDurationInput ? 'block' : 'none' }}
      >
        <FormattedNumberInput
          placeholder="30"
          value={value}
          suffix="days"
          onChange={onValueChange}
          min={1}
        />
      </Form.Item>
    </Space>
  )
}

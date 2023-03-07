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
        <Trans>Set cycle duration</Trans>
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
        className={showDurationInput ? 'block' : 'none'}
        extra={
          <p>
            <Trans>
              How long one cycle will last. Your project's rules are locked
              during each cycle. Edits you make to your project's rules during a
              cycle will only take effect at the start of the next cycle.
            </Trans>
          </p>
        }
        name={name}
        label={hideLabel ? undefined : t`Cycle duration`}
        {...formItemProps}
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

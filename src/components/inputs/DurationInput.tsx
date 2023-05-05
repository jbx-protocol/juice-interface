import { Trans } from '@lingui/macro'
import { Select } from 'antd'
import { JuiceSelect } from 'components/inputs/JuiceSelect'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { DurationUnitsOption } from 'constants/time'
import { ChangeEvent } from 'react'

export interface DurationInputValue {
  duration: number | undefined
  unit: DurationUnitsOption
}

export const DurationInput: React.FC<
  React.PropsWithChildren<{
    value?: DurationInputValue
    onChange?: (value: DurationInputValue | undefined) => void
  }>
> = ({ value, onChange }) => {
  const handleChange = (incoming: DurationInputValue) => {
    onChange?.(incoming)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const unit = value?.unit ?? 'days'
    if (!e.target.value) {
      handleChange({ duration: undefined, unit })
      return
    }

    const duration = parseInt(e.target.value)
    if (isNaN(duration)) return
    if (duration <= 0) {
      handleChange({ duration: 1, unit })
      return
    }

    handleChange({ duration: duration, unit })
  }

  return (
    <div className="flex gap-2">
      <JuiceInput
        placeholder="14"
        value={value?.duration ?? ''}
        onChange={handleInputChange}
      />
      <JuiceSelect
        className="min-w-[6.75rem] flex-1"
        defaultValue="days"
        value={value?.unit}
        onChange={unit =>
          handleChange({
            duration: value?.duration ?? 0,
            unit: unit as DurationUnitsOption,
          })
        }
      >
        <Select.Option value="days">
          <Trans>Days</Trans>
        </Select.Option>
        <Select.Option value="hours">
          <Trans>Hours</Trans>
        </Select.Option>
        <Select.Option value="minutes">
          <Trans>Minutes</Trans>
        </Select.Option>
        <Select.Option value="seconds">
          <Trans>Seconds</Trans>
        </Select.Option>
      </JuiceSelect>
    </div>
  )
}

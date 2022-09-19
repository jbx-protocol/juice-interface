import { Trans } from '@lingui/macro'
import { Input, Select } from 'antd'
import { DurationUnitsOption } from 'constants/time'
import { ChangeEvent, CSSProperties } from 'react'

export interface DurationInputValue {
  duration: number | undefined
  unit: DurationUnitsOption
}

export const DurationInput: React.FC<{
  style?: CSSProperties
  value?: DurationInputValue
  onChange?: (value: DurationInputValue | undefined) => void
}> = ({ style, value, onChange }) => {
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
    <div style={{ display: 'flex', gap: '0.625rem', ...style }}>
      <Input
        placeholder="14"
        value={value?.duration ?? ''}
        onChange={handleInputChange}
      />
      <Select
        style={{ flex: 1, minWidth: '6.75rem' }}
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
      </Select>
    </div>
  )
}

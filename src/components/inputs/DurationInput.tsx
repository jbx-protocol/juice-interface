import { t } from '@lingui/macro'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { DurationUnitsOption } from 'models/time'
import { ChangeEvent } from 'react'
import { JuiceListbox } from './JuiceListbox'

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

  const handleListboxChange = (option: DurationOption) => {
    handleChange({ duration: value?.duration ?? 0, unit: option.value })
  }

  const listboxValue =
    durationOptions().find(option => option.value === value?.unit) ??
    durationOptions()[0]

  return (
    <div className="flex gap-2">
      <JuiceInput
        placeholder="14"
        value={value?.duration ?? ''}
        onChange={handleInputChange}
      />

      <JuiceListbox
        className="min-w-[6.75rem] flex-1"
        options={durationOptions()}
        value={listboxValue}
        onChange={handleListboxChange}
      />
    </div>
  )
}

export interface DurationOption {
  label: string
  value: DurationUnitsOption
}

export const durationOptions = (): DurationOption[] => [
  { label: t`Days`, value: 'days' },
  { label: t`Hours`, value: 'hours' },
  { label: t`Minutes`, value: 'minutes' },
  { label: t`Seconds`, value: 'seconds' },
]

import { InputNumber, Slider } from 'antd'
import { useEffect, useState } from 'react'

export default function NumberSlider({
  min,
  max,
  step,
  sliderValue,
  suffix,
  onChange,
  defaultValue,
}: {
  min?: number
  max?: number
  step?: number
  sliderValue?: number
  suffix?: string
  onChange?: (num: number | undefined) => void
  defaultValue?: number
}) {
  const [_value, setValue] = useState<number>()

  const inputConfig = {
    min: min ?? 0,
    max: max ?? 100,
    step: step ?? 0.1,
  }

  const updateValue = (val?: number) => {
    setValue(val)
    if (onChange) onChange(val)
  }

  useEffect(() => setValue(sliderValue), [])

  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <Slider
        {...inputConfig}
        tooltipVisible={false}
        style={{ flex: 1, marginRight: 20 }}
        value={_value}
        onChange={(val: number) => updateValue(val)}
        defaultValue={defaultValue}
      />
      <InputNumber
        {...inputConfig}
        value={_value}
        formatter={(val?: string | number | undefined) =>
          `${val ?? ''}${suffix ?? ''}`
        }
        parser={(val?: string) =>
          parseFloat(val?.replace(suffix ?? '', '') ?? '0')
        }
        onChange={(val: string | number | null | undefined) => {
          const newVal =
            (typeof val === 'string' ? parseFloat(val) : val) ?? undefined
          updateValue(newVal)
        }}
        defaultValue={defaultValue}
      />
    </div>
  )
}

import { Form, Slider } from 'antd'
import { useEffect, useState } from 'react'

import { roundDown } from 'components/formItems/formHelpers'

import { FormItemExt } from '../formItems/formItemExt'
import { JuiceInputNumber } from './JuiceInputNumber'

export default function NumberSlider({
  className,
  min,
  max,
  step,
  sliderValue,
  suffix,
  onChange,
  defaultValue,
  disabled,
  name, // Name is required for form validation
  formItemProps,
}: {
  className?: string
  min?: number
  max?: number
  step?: number
  sliderValue?: number
  suffix?: string
  onChange?: (num: number | undefined) => void
  defaultValue?: number
} & FormItemExt) {
  const [_value, setValue] = useState<number | undefined>(
    sliderValue ?? defaultValue,
  )

  const inputConfig = {
    min: min ?? 0,
    max: max ?? 100,
    step: step ?? 0.1,
  }

  const decimals = inputConfig.step.toString().split('.')[1].length

  const updateValue = (val?: number) => {
    setValue(val)
    if (onChange) onChange(val)
  }

  useEffect(() => {
    setValue(sliderValue)
  }, [sliderValue])

  return (
    <div className={className}>
      <div className="mb-4 flex items-center">
        <Form.Item className="mb-0 w-full" name={name}>
          <Slider
            className="mr-5 flex-1"
            {...inputConfig}
            value={_value}
            onChange={(val: number) => updateValue(val)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item
          className="mb-0"
          name={name}
          rules={formItemProps?.rules ?? []}
        >
          <JuiceInputNumber
            {...inputConfig}
            value={_value}
            defaultValue={`${defaultValue}%`}
            disabled={disabled}
            formatter={(val?: string | number | undefined) => {
              let _val = val?.toString() ?? '0'

              if (_val.includes('.') && _val.split('.')[1].length > decimals) {
                _val = roundDown(parseFloat(_val), decimals).toString()
              }

              return `${_val ?? ''}${suffix ?? ''}`
            }}
            parser={(val?: string) =>
              parseFloat(val?.replace(suffix ?? '', '') ?? '0')
            }
            onChange={(val: string | number | null | undefined) => {
              const newVal =
                (typeof val === 'string' ? parseFloat(val) : val) ?? undefined
              updateValue(newVal)
            }}
          />
        </Form.Item>
      </div>
      {formItemProps?.extra ? (
        <div className="ant-form-item-extra">{formItemProps.extra}</div>
      ) : null}
    </div>
  )
}

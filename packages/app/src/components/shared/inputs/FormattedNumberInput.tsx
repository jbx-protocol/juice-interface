import { InputNumber } from 'antd'
import React, { CSSProperties } from 'react'
import { formattedNum } from 'utils/formatCurrency'

export default function FormattedNumberInput({
  style,
  min,
  max,
  step,
  value,
  disabled,
  placeholder,
  suffix,
  accessory,
  onChange,
}: {
  style?: CSSProperties
  min?: number
  max?: number
  step?: number
  value?: string
  placeholder?: string
  disabled?: boolean
  suffix?: string
  accessory?: JSX.Element
  onChange?: (val?: string) => void
}) {
  const thousandsSeparator = ','
  const decimalSeparator = '.'
  const _suffix = suffix ? ` ${suffix}` : ''
  const allowedValueChars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    thousandsSeparator,
    decimalSeparator,
  ]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      <InputNumber
        min={min}
        max={max}
        style={{ width: '100%' }}
        value={value !== undefined ? parseFloat(value) : undefined}
        step={step}
        placeholder={placeholder}
        formatter={(val?: string | number | undefined) =>
          (formattedNum(val, {
            thousandsSeparator,
            decimalSeparator,
          }) ?? '0') + _suffix
        }
        parser={(val?: string) =>
          (val ?? '0')
            .replace(thousandsSeparator, '')
            .replace(_suffix, '')
            .split('')
            .filter(char => allowedValueChars.includes(char))
            .join('')
        }
        disabled={disabled}
        onChange={value => {
          if (onChange) onChange(value?.toString())
        }}
      />
      {accessory ? <div style={{ marginLeft: 8 }}>{accessory}</div> : null}
    </div>
  )
}

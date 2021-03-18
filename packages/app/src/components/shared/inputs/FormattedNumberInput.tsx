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
  onChange,
}: {
  style?: CSSProperties
  min?: number
  max?: number
  step?: number
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (val?: string) => void
}) {
  const thousandsSeparator = ','
  const decimalSeparator = '.'

  return (
    <InputNumber
      min={min}
      max={max}
      style={style}
      value={value ? parseFloat(value) : undefined}
      placeholder={placeholder}
      formatter={(val?: string | number | undefined) =>
        formattedNum(val, {
          thousandsSeparator,
          decimalSeparator,
        }) ?? ''
      }
      parser={(val?: string) => (val ?? '0').replace(thousandsSeparator, '')}
      disabled={disabled}
      onChange={value => {
        if (onChange) onChange(value?.toString())
      }}
    />
  )
}

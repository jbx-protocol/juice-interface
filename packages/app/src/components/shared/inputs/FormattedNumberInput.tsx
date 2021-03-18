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
  onChange?: (val?: string) => void
}) {
  const thousandsSeparator = ','
  const decimalSeparator = '.'

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
        placeholder={placeholder}
        formatter={(val?: string | number | undefined) =>
          formattedNum(val, {
            thousandsSeparator,
            decimalSeparator,
          }) ?? '0'
        }
        parser={(val?: string) => (val ?? '0').replace(thousandsSeparator, '')}
        disabled={disabled}
        onChange={value => {
          if (onChange) onChange(value?.toString())
        }}
      />
      {suffix ? <div style={{ marginLeft: 8 }}>{suffix}</div> : ''}
    </div>
  )
}

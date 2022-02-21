import { InputNumber, Form } from 'antd'
import { CSSProperties, useLayoutEffect, useMemo, useState } from 'react'
import { formattedNum } from 'utils/formatNumber'

import { FormItemExt } from 'components/shared/formItems/formItemExt'

export default function FormattedNumberInput({
  style,
  min,
  max,
  step,
  value,
  disabled,
  placeholder,
  suffix,
  prefix,
  accessory,
  formItemProps,
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
  prefix?: string
  accessory?: JSX.Element
  onChange?: (val?: string) => void
} & FormItemExt) {
  const [accessoryWidth, setAccessoryWidth] = useState<number>(0)

  const accessoryId = useMemo(() => 'accessory' + Math.random() * 100, [])

  const thousandsSeparator = ','
  const decimalSeparator = '.'
  const _suffix = suffix ? ` ${suffix}` : ''
  const _prefix = prefix ? `${prefix}` : ''
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

  useLayoutEffect(() => {
    const accessoryContainer = document.getElementById(accessoryId)
    if (!accessoryContainer) return
    setAccessoryWidth(accessoryContainer.clientWidth)
  }, [accessoryId])

  return (
    <div className="formatted-number-input">
      <Form.Item {...formItemProps}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...style,
          }}
        >
          <InputNumber
            className={accessory ? 'antd-no-number-handler' : ''}
            min={min}
            max={max}
            style={{ width: '100%' }}
            value={value !== undefined ? parseFloat(value) : undefined}
            step={step ?? 1}
            stringMode={true}
            placeholder={placeholder}
            formatter={(val?: string | number | undefined) =>
              _prefix +
              (val
                ? formattedNum(val, {
                    thousandsSeparator,
                    decimalSeparator,
                  })
                : '') +
              _suffix
            }
            parser={(val?: string) =>
              parseFloat(
                (val !== undefined ? val : '0')
                  .replace(new RegExp(thousandsSeparator, 'g'), '')
                  .replace(_prefix, '')
                  .replace(_suffix, '')
                  .split('')
                  .filter(char => allowedValueChars.includes(char))
                  .join('') || '0',
              )
            }
            disabled={disabled}
            onChange={_value => {
              if (onChange) onChange(_value?.toString())
            }}
          />
          <div
            style={{
              marginLeft: accessoryWidth * -1 - 5,
              zIndex: 1,
              fontSize: '.8rem',
            }}
          >
            {accessory && <div id={accessoryId}>{accessory}</div>}
          </div>
        </div>
      </Form.Item>
    </div>
  )
}

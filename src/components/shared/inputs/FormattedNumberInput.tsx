import { Input, Form } from 'antd'
import { CSSProperties, useLayoutEffect, useMemo, useState } from 'react'
import NumberFormat from 'react-number-format'

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

  useLayoutEffect(() => {
    const accessoryContainer = document.getElementById(accessoryId)
    if (!accessoryContainer) return
    setAccessoryWidth(accessoryContainer.clientWidth)
  }, [accessoryId])

  return (
    <div className="formatted-number-input">
      <Form.Item name={'numberValidator'} {...formItemProps}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            ...style,
          }}
        >
          <NumberFormat
            customInput={Input}
            className={accessory ? 'antd-no-number-handler' : ''}
            min={min}
            max={max}
            style={{ width: '100%' }}
            value={value || ''}
            step={step ?? 1}
            prefix={prefix}
            suffix={suffix}
            placeholder={placeholder}
            disabled={disabled}
            thousandSeparator
            isNumericString
            onValueChange={values => onChange?.(values?.value || undefined)}
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

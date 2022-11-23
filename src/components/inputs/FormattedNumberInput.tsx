import { classNames } from 'utils/classNames'
import { formattedNum } from 'utils/format/formatNumber'
import { JuiceInputNumber } from './JuiceInputNumber'

export default function FormattedNumberInput({
  className,
  min,
  max,
  step,
  value,
  disabled,
  placeholder,
  suffix,
  prefix,
  accessory,
  onChange,
  onBlur,
  isInteger,
}: {
  className?: string
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
  onBlur?: (val?: string) => void
  isInteger?: boolean
}) {
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
  ]
  if (!isInteger) {
    allowedValueChars.push(decimalSeparator)
  }

  return (
    <div className={classNames('relative flex items-center', className)}>
      <JuiceInputNumber
        className={classNames(
          'w-full',
          accessory ? 'antd-no-number-handler' : '',
        )}
        min={min}
        max={max}
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
        onBlur={_value => {
          onBlur?.(_value?.toString())
        }}
        onChange={_value => {
          onChange?.(_value?.toString())
        }}
      />
      <div className="absolute right-[5px] z-[1] text-xs">
        {accessory && <div>{accessory}</div>}
      </div>
    </div>
  )
}

import { WAD_DECIMALS } from 'constants/numbers'
import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'
import { formattedNum } from 'utils/format/formatNumber'
import { JuiceInputNumber } from './JuiceInputNumber'

export default function FormattedNumberInput({
  className,
  step,
  value,
  placeholder,
  suffix,
  prefix,
  accessory,
  accessoryPosition = 'right',
  onChange,
  onBlur,
  isInteger,
  ...props
}: Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
> & {
  className?: string
  step?: number
  value?: string
  placeholder?: string
  disabled?: boolean
  suffix?: string
  prefix?: string
  accessory?: JSX.Element
  accessoryPosition?: 'left' | 'right'
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
    <div className={'relative flex items-center'}>
      <JuiceInputNumber
        className={twMerge(
          'h-full w-full',
          'formatted-number-input',
          accessory ? 'antd-no-number-handler' : '',
          accessoryPosition === 'left' ? 'pl-7' : null,
          className,
        )}
        value={value}
        step={step ?? 1}
        placeholder={placeholder}
        formatter={(val?: string | undefined) => {
          let formatted =
            _prefix +
            (val
              ? formattedNum(val, {
                  thousandsSeparator,
                  decimalSeparator,
                })
              : '') +
            _suffix

          // Remove any unallowed chars that may be added by formattedNum()
          formatted = formatted
            .split('')
            .filter(char => allowedValueChars.includes(char))
            .join('')

          if (
            val?.endsWith(decimalSeparator) &&
            !formatted.endsWith(decimalSeparator)
          ) {
            // Include decimal if stripped by formattedNum()
            formatted += decimalSeparator
          }

          return formatted
        }}
        parser={(val?: string) => {
          if (val === undefined || !val.length) return ''
          // Stops user from entering hex values
          if (/^0?0x[0-9a-fA-F]+$/.test(val)) return '0'
          let processedValue =
            val
              .replace(new RegExp(thousandsSeparator, 'g'), '')
              .replace(_prefix, '')
              .replace(_suffix, '')
              .split('')
              .filter(char => allowedValueChars.includes(char))
              .join('')
              .substring(0, WAD_DECIMALS) || '0'

          // Enforce the presence of the prefix
          if (_prefix && !val.startsWith(_prefix)) {
            processedValue = _prefix + processedValue
          }

          return processedValue
        }}
        onBlur={_value => {
          onBlur?.(_value?.toString())
        }}
        onChange={_value => {
          onChange?.(_value?.toString())
        }}
        {...props}
      />
      <div
        className={twMerge(
          'absolute z-auto text-xs',
          accessoryPosition === 'right' ? 'right-[5px]' : 'left-[10px]',
        )}
      >
        {accessory && <div>{accessory}</div>}
      </div>
    </div>
  )
}

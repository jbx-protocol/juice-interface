import { Trans } from '@lingui/macro'
import { Input, Select } from 'antd'
import { ChangeEvent, CSSProperties, useMemo } from 'react'

export interface CurrencySelectInputValue {
  amount: string | undefined
  currency: 'eth' | 'usd'
}

export const CurrencySelectInput: React.FC<{
  style?: CSSProperties
  value?: CurrencySelectInputValue
  onChange?: (value: CurrencySelectInputValue | undefined) => void
}> = ({ style, value, onChange }) => {
  const handleChange = (incoming: CurrencySelectInputValue) => {
    onChange?.(incoming)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currency = value?.currency ?? 'eth'
    if (!e.target.value) {
      handleChange({ amount: undefined, currency })
      return
    }

    const amount = parseInt(e.target.value)
    if (isNaN(amount)) return
    if (amount <= 0) {
      handleChange({ amount: '1', currency })
      return
    }

    handleChange({ amount: amount.toString(), currency })
  }

  const prefix = useMemo(() => {
    if (value?.currency === 'usd') {
      return '$'
    }
    return 'Ξ'
  }, [value?.currency])

  return (
    <div style={{ display: 'flex', gap: '0.625rem', ...style }}>
      <Input
        prefix={prefix}
        placeholder="0"
        value={value?.amount ?? ''}
        onChange={handleInputChange}
      />
      <Select
        style={{ flex: 1, minWidth: '6.75rem' }}
        defaultValue="eth"
        value={value?.currency}
        onChange={unit =>
          handleChange({
            amount: value?.amount ?? '0',
            currency: unit as 'eth' | 'usd',
          })
        }
      >
        <Select.Option value="eth">
          <Trans>ETH</Trans>
        </Select.Option>
        <Select.Option value="usd">
          <Trans>USD</Trans>
        </Select.Option>
      </Select>
    </div>
  )
}

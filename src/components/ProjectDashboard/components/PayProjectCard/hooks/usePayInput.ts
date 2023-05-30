import { useState } from 'react'
import { PayInputValue } from '../components/PayInput'

export const usePayInput = (
  v?: PayInputValue,
  oc?: (value: PayInputValue) => void,
) => {
  const [_value, _setValue] = useState<PayInputValue>({
    amount: '',
    currency: 'eth',
  })
  const value = v ?? _value
  const onChange = oc ?? _setValue

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    onChange({
      ...value,
      amount: v,
    })
  }
  const onCurrencyChange = () => {
    onChange({
      ...value,
      currency: value.currency === 'eth' ? 'usd' : 'eth',
    })
  }

  return {
    value,
    onInputChange,
    onCurrencyChange,
  }
}

import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { useState } from 'react'
import { PayInputValue } from '../components/PayInput'

export const usePayInput = (
  v?: PayInputValue,
  oc?: (value: PayInputValue) => void,
) => {
  const [_value, _setValue] = useState<PayInputValue>({
    amount: '',
    currency: V2V3_CURRENCY_ETH,
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
      currency:
        value.currency === V2V3_CURRENCY_ETH
          ? V2V3_CURRENCY_USD
          : V2V3_CURRENCY_ETH,
    })
  }

  return {
    value,
    onInputChange,
    onCurrencyChange,
  }
}

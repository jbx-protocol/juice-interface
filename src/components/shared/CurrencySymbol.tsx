import { CurrencyOption } from 'models/currency-option'
import { CSSProperties } from 'react'
import { currencyStyle, currencySymbol } from 'utils/v1/currency'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency: CurrencyOption
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        ...style,
        ...currencyStyle(currency),
      }}
    >
      {currencySymbol(currency)}
    </span>
  )
}

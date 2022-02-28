import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties } from 'react'
import { V1CurrencyStyle, V1CurrencySymbol } from 'utils/v1/currency'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency: V1CurrencyOption
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        ...style,
        ...V1CurrencyStyle(currency),
      }}
    >
      {V1CurrencySymbol(currency)}
    </span>
  )
}

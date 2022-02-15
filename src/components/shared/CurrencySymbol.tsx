import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties } from 'react'
import { currencyStyle, currencySymbol } from 'utils/v1/currency'

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
        ...currencyStyle(currency),
      }}
    >
      {currencySymbol(currency)}
    </span>
  )
}

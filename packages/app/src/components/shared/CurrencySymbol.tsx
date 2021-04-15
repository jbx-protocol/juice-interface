import { CurrencyOption } from 'models/currencyOption'
import { CSSProperties } from 'react'
import { currencyStyle, currencySymbol } from 'utils/currency'

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

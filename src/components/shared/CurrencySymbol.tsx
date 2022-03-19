import { CurrencyContext } from 'contexts/currencyContext'
import { CSSProperties, useContext } from 'react'

import { CurrencyOption } from 'models/currencyOption'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency: CurrencyOption
  style?: CSSProperties
}) {
  const { currencyMetadata } = useContext(CurrencyContext)
  const metadata = currencyMetadata[currency]

  return (
    <span
      style={{
        ...style,
        ...metadata.style,
      }}
    >
      {metadata.symbol}
    </span>
  )
}

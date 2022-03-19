import { CSSProperties } from 'react'

import { CurrencyName, CURRENCY_METADATA } from 'constants/currency'

export default function CurrencySymbol({
  currency,
  style,
}: {
  currency?: CurrencyName
  style?: CSSProperties
}) {
  if (!currency) return null

  const metadata = CURRENCY_METADATA[currency]

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

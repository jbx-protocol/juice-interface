import { CurrencyName, CURRENCY_METADATA } from 'constants/currency'

export default function CurrencySymbol({
  currency,
}: {
  currency?: CurrencyName
}) {
  if (!currency) return null

  const metadata = CURRENCY_METADATA[currency]

  return (
    <span className={currency === 'ETH' ? 'font-sans' : ''}>
      {metadata.symbol}
    </span>
  )
}

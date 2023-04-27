import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'

export default function CurrencySymbol({
  currency,
}: {
  currency?: CurrencyName
}) {
  if (!currency) return null

  const metadata = CURRENCY_METADATA[currency]

  return <>{metadata.symbol}</>
}

import CurrencySymbol from 'components/shared/CurrencySymbol'

import { useEtherPrice } from 'hooks/EtherPrice'

import { CURRENCY_METADATA } from 'constants/currency'

export default function EthPrice() {
  const price = useEtherPrice()
  return (
    <div>
      <CurrencySymbol currency="USD" />
      {price?.toFixed(2)}/{CURRENCY_METADATA.ETH.name}
    </div>
  )
}

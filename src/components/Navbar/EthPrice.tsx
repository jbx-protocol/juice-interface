import CurrencySymbol from 'components/shared/CurrencySymbol'

import { useEtherPrice } from 'hooks/v1/EtherPrice'
import { V1CurrencyName } from 'utils/v1/currency'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

export default function EthPrice() {
  const price = useEtherPrice()
  return (
    <div>
      <CurrencySymbol currency={V1_CURRENCY_USD} />
      {price?.toFixed(2)}/{V1CurrencyName(V1_CURRENCY_ETH)}
    </div>
  )
}

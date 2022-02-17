import CurrencySymbol from 'components/shared/CurrencySymbol'

import { useEtherPrice } from 'hooks/v1/EtherPrice'
import { currencyName } from 'utils/v1/currency'

import { V1_CURRENCY_USD } from 'constants/v1/currency'

export default function EthPrice() {
  const price = useEtherPrice()
  return (
    <div>
      <CurrencySymbol currency={V1_CURRENCY_USD} />
      {price?.toFixed(2)}/{currencyName(0)}
    </div>
  )
}

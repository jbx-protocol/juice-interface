import CurrencySymbol from 'components/shared/CurrencySymbol'

import { useEtherPrice } from 'hooks/EtherPrice'
import { currencyName } from 'utils/currency'

import { CURRENCY_USD } from 'constants/currency'

export default function EthPrice() {
  const price = useEtherPrice()
  return (
    <div>
      <CurrencySymbol currency={CURRENCY_USD} />
      {price?.toFixed(2)}/{currencyName(0)}
    </div>
  )
}

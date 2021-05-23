import CurrencySymbol from 'components/shared/CurrencySymbol'
import { useEtherPrice } from 'hooks/EtherPrice'
import { currencyName } from 'utils/currency'

export default function EthPrice() {
  const price = useEtherPrice()
  return (
    <div>
      <CurrencySymbol currency={1} />
      {price}/{currencyName(0)}
    </div>
  )
}

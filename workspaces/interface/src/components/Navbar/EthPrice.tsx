import CurrencySymbol from 'components/CurrencySymbol'
import { CURRENCY_METADATA } from 'constants/currency'
import { EtherPriceContext } from 'contexts/EtherPriceContext'
import { useContext } from 'react'

export default function EthPrice() {
  const { ethInUsd } = useContext(EtherPriceContext)
  return (
    <div>
      <CurrencySymbol currency="USD" />
      {ethInUsd?.toFixed(2)}/{CURRENCY_METADATA.ETH.name}
    </div>
  )
}

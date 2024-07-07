import { EtherPriceContext } from 'contexts/EtherPrice/EtherPriceContext'
import { useContext } from 'react'
import { CurrencyUtils } from 'utils/format/formatCurrency'

export function useCurrencyConverter() {
  const { ethInUsd } = useContext(EtherPriceContext)
  return new CurrencyUtils(ethInUsd)
}

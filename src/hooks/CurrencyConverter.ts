import { EtherPriceContext } from 'contexts/EtherPriceContext'
import { useContext, useMemo } from 'react'
import { CurrencyUtils } from 'utils/formatCurrency'

export function useCurrencyConverter() {
  const { ethInUsd } = useContext(EtherPriceContext)
  return useMemo(() => new CurrencyUtils(ethInUsd), [ethInUsd])
}

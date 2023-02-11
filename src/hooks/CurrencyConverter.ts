import { EtherPriceContext } from 'contexts/EtherPrice/EtherPriceContext'
import { useContext, useMemo } from 'react'
import { CurrencyUtils } from 'utils/format/formatCurrency'

export function useCurrencyConverter() {
  const { ethInUsd } = useContext(EtherPriceContext)
  return useMemo(() => new CurrencyUtils(ethInUsd), [ethInUsd])
}

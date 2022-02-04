import { useEtherPrice } from 'hooks/v1/EtherPrice'
import { useMemo } from 'react'
import { CurrencyUtils } from 'utils/formatCurrency'

export function useCurrencyConverter() {
  const usdPerEth = useEtherPrice()

  return useMemo(() => new CurrencyUtils(usdPerEth), [usdPerEth])
}

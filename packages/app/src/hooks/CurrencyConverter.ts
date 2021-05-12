import { useEtherPrice } from 'hooks/EtherPrice'
import { useMemo } from 'react'
import { CurrencyUtils } from 'utils/formatCurrency'

export function useCurrencyConverter() {
  const usdPerEth = useEtherPrice()

  return useMemo(() => new CurrencyUtils(usdPerEth), [usdPerEth])
}

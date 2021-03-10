import { useMemo } from 'react'

import { CurrencyUtils } from '../utils/formatCurrency'
import { useExchangePrice } from './ExchangePrice'

export function useCurrencyConverter() {
  const exchangePrice = useExchangePrice()

  return useMemo(() => new CurrencyUtils(exchangePrice), [exchangePrice])
}

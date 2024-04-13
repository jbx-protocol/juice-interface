import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'

import { CurrencyContext } from 'contexts/shared/CurrencyContext'
import { CurrencyOption } from 'models/currencyOption'
import { useContext, useMemo } from 'react'

// Converts an amount (ETH or USD) to WEI
export default function useWeiConverter<C extends CurrencyOption>({
  currency,
  amount,
}: {
  currency?: C
  amount?: string
}) {
  const converter = useCurrencyConverter()
  const {
    currencies: { USD },
  } = useContext(CurrencyContext)

  return useMemo(() => {
    if (currency === USD) {
      return converter.usdToWei(amount)
    }
    return parseEther(amount || '0')
  }, [USD, amount, converter, currency])
}

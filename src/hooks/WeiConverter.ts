import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { parseEther } from 'ethers/lib/utils'

import { useContext } from 'react'
import { CurrencyContext } from 'contexts/currencyContext'
import { CurrencyOption } from 'models/currencyOption'

// Converts an amount (ETH or USD) to WEIw
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
  if (currency === USD) {
    return converter.usdToWei(amount)
  }

  return parseEther(amount ?? '0')
}

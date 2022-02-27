import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { parseEther } from 'ethers/lib/utils'

import { useContext } from 'react'
import { CurrencyContext } from 'contexts/currencyContext'

export default function AmountToWei({
  currency,
  amount,
}: {
  currency?: number
  amount?: string
}) {
  const converter = useCurrencyConverter()
  const {
    currencies: { currencyUSD },
  } = useContext(CurrencyContext)
  if (currency === currencyUSD) {
    return converter.usdToWei(amount)
  }

  return parseEther(amount ?? '0')
}

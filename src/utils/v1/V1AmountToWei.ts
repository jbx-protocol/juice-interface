import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { parseEther } from 'ethers/lib/utils'

import { V1_CURRENCY_USD } from 'constants/v1/currency'

export default function V1AmountToWei({
  currency,
  amount,
}: {
  currency?: number
  amount?: string
}) {
  const converter = useCurrencyConverter()
  if (currency === V1_CURRENCY_USD) {
    return converter.usdToWei(amount)
  }

  return parseEther(amount ?? '0')
}

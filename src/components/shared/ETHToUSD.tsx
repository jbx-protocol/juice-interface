import { BigNumber } from '@ethersproject/bignumber'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { formatWad } from 'utils/formatNumber'
import { LoadingOutlined } from '@ant-design/icons'

import CurrencySymbol from './CurrencySymbol'

// Takes an ETH amount and returns equiv in USD
export default function ETHToUSD({
  ethAmount,
}: {
  ethAmount: BigNumber | string
}) {
  const converter = useCurrencyConverter()
  const usdAmount = converter.wadToCurrency(ethAmount, 'USD', 'ETH')
  const usdAmountFormatted = formatWad(usdAmount, {
    precision: 2,
    padEnd: true,
  })
  if (usdAmount?.gt(0)) {
    return (
      <span>
        <CurrencySymbol currency="USD" />
        {usdAmountFormatted}
      </span>
    )
  }
  return <LoadingOutlined style={{ fontSize: 16 }} />
}

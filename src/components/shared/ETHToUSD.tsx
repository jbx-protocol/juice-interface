import { BigNumber } from 'ethers'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { formatWad } from 'utils/formatNumber'
import { LoadingOutlined } from '@ant-design/icons'

import { V1_CURRENCY_USD } from 'constants/v1/currency'

import CurrencySymbol from './CurrencySymbol'

// Takes an ETH amount and returns equiv in USD
export default function ETHToUSD({
  ethAmount,
}: {
  ethAmount: BigNumber | string
}) {
  const converter = useCurrencyConverter()
  const usdAmount = converter.wadToCurrency(ethAmount, 1, 0)
  const usdAmountFormatted = formatWad(usdAmount, {
    precision: 2,
    padEnd: true,
  })
  if (usdAmount?.gt(0)) {
    return (
      <span>
        <CurrencySymbol currency={V1_CURRENCY_USD} />
        {usdAmountFormatted}
      </span>
    )
  }
  return <LoadingOutlined style={{ fontSize: 16 }} />
}

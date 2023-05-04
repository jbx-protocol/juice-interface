import { PRECISION_ETH } from 'constants/currency'
import { BigNumber } from 'ethers'
import { HTMLProps } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function TokenAmount({
  amountWad,
  tokenSymbol,
  decimals,
  precision = PRECISION_ETH,
  ...props
}: {
  amountWad: BigNumber
  tokenSymbol?: string
  decimals?: number
  precision?: number
} & HTMLProps<HTMLSpanElement>) {
  const amountFormatted = formatWad(amountWad, {
    precision: precision,
    decimals,
  })
  const tokensText = tokenSymbolText({
    tokenSymbol,
    plural: parseFloat(fromWad(amountWad)) !== 1,
  })

  return (
    <span {...props}>
      {amountFormatted} {tokensText}
    </span>
  )
}

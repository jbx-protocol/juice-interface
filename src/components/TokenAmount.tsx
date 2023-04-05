import { BigNumber } from '@ethersproject/bignumber'
import { PRECISION_ETH } from 'constants/currency'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function TokenAmount({
  amountWad,
  tokenSymbol,
  decimals,
}: {
  amountWad: BigNumber
  tokenSymbol?: string
  decimals?: number
}) {
  const amountFormatted = formatWad(amountWad, {
    precision: PRECISION_ETH,
    decimals,
  })
  const tokensText = tokenSymbolText({
    tokenSymbol,
    plural: parseFloat(fromWad(amountWad)) !== 1,
  })

  return (
    <span>
      {amountFormatted} {tokensText}
    </span>
  )
}

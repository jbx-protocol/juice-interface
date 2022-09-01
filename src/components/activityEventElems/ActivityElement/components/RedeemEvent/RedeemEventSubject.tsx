import { BigNumber } from '@ethersproject/bignumber'
import { primaryContentFontSize } from 'components/activityEventElems/styles'
import { formatWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function RedeemEventSubject({
  amount,
  tokenSymbol,
}: {
  amount: BigNumber | undefined
  tokenSymbol: string | undefined
}) {
  return (
    <div style={{ fontSize: primaryContentFontSize }}>
      {formatWad(amount ?? 0, { precision: 0 })}{' '}
      {tokenSymbolText({
        tokenSymbol: tokenSymbol,
        capitalize: false,
        plural: true,
      })}
    </div>
  )
}

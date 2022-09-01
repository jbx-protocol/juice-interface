import { BigNumber } from '@ethersproject/bignumber'
import { primaryContentFontSize } from 'components/activityEventElems/styles'
import { formatWad, fromWad } from 'utils/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { useDistributeReservedTokensEvents } from './hooks/DistributeReservedTokensEvents'

export function DistributeReservedTokensEventSubject({
  id,
  tokenCount,
  tokenSymbol,
}: {
  id: string | undefined
  tokenCount: BigNumber | undefined
  tokenSymbol: string | undefined
}) {
  const distributeReservedTokensEvents = useDistributeReservedTokensEvents({
    id,
  })
  if (!distributeReservedTokensEvents?.length) {
    // This is duplicate information - shown in `Extra` under the beneficiary.
    return null
  }

  return (
    <div
      style={{
        fontSize: primaryContentFontSize,
      }}
    >
      {formatWad(tokenCount, { precision: 0 })}{' '}
      {tokenSymbolText({
        tokenSymbol: tokenSymbol,
        capitalize: false,
        plural: parseInt(fromWad(tokenCount) || '0') !== 1,
      })}
    </div>
  )
}

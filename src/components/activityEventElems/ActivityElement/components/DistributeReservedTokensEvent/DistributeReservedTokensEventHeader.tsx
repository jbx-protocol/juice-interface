import { Trans } from '@lingui/macro'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function DistributeReservedTokensEventHeader({
  tokenSymbol,
}: {
  tokenSymbol: string | undefined
}) {
  return (
    <Trans>
      Distributed reserved{' '}
      {tokenSymbolText({
        tokenSymbol: tokenSymbol,
        capitalize: false,
        plural: true,
      })}
    </Trans>
  )
}

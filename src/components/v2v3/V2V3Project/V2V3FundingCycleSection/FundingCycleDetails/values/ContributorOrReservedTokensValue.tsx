import { Trans } from '@lingui/macro'
import { formattedNum } from 'utils/format/formatNumber'

export function ContributorOrReservedTokensValue({
  value,
  tokenSymbol,
}: {
  value: string
  tokenSymbol: string
}) {
  return (
    <span>
      <Trans>
        {formattedNum(value)} {tokenSymbol}/ETH
      </Trans>
    </span>
  )
}

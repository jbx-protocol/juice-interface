import { Trans } from '@lingui/macro'
import { formattedNum } from 'utils/format/formatNumber'

export function PayerOrReservedTokensValue({
  value,
  tokenSymbol,
  zeroAsUnchanged,
}: {
  value: string
  tokenSymbol: string
  zeroAsUnchanged?: boolean
}) {
  if (zeroAsUnchanged && value === '0') {
    return <Trans>Unchanged</Trans>
  }

  return (
    <span>
      <Trans>
        {formattedNum(value)} {tokenSymbol}/ETH
      </Trans>
    </span>
  )
}

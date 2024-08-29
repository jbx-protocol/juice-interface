import { Trans } from '@lingui/macro'
import { WEIGHT_UNCHANGED } from 'packages/v4/utils/fundingCycle'

export function IssuanceRateValue({
  value,
  tokenSymbol,
  zeroAsUnchanged,
}: {
  value: number
  tokenSymbol: string
  zeroAsUnchanged?: boolean
}) {
  if (zeroAsUnchanged && value === WEIGHT_UNCHANGED) {
    return <Trans>Unchanged</Trans>
  }

  return (
    <Trans>
      {value} {tokenSymbol}/ETH
    </Trans>
  )
}

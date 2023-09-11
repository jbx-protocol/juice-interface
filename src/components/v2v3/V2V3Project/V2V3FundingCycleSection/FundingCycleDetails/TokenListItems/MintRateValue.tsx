import { Trans } from '@lingui/macro'
import { BigNumber } from 'ethers'
import { formattedNum } from 'utils/format/formatNumber'
import { WEIGHT_UNCHANGED } from 'utils/v2v3/fundingCycle'
import { formatIssuanceRate } from 'utils/v2v3/math'

export function MintRateValue({
  value,
  tokenSymbol,
  zeroAsUnchanged,
}: {
  value: BigNumber
  tokenSymbol: string
  zeroAsUnchanged?: boolean
}) {
  if (zeroAsUnchanged && value.eq(WEIGHT_UNCHANGED)) {
    return <Trans>Unchanged</Trans>
  }

  return (
    <Trans>
      {formattedNum(formatIssuanceRate(value.toString()))} {tokenSymbol}/ETH
    </Trans>
  )
}

import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { WEIGHT_UNCHANGED } from 'packages/v2v3/utils/fundingCycle'
import { formatIssuanceRate } from 'packages/v2v3/utils/math'
import { formattedNum } from 'utils/format/formatNumber'

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

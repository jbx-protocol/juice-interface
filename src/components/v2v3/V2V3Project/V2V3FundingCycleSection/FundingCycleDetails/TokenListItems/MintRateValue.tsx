import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { formattedNum } from 'utils/format/formatNumber'
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
  if (zeroAsUnchanged && value.eq(0)) {
    return <Trans>Unchanged</Trans>
  }

  return (
    <Trans>
      {formattedNum(formatIssuanceRate(value.toString()))} {tokenSymbol}/ETH
    </Trans>
  )
}

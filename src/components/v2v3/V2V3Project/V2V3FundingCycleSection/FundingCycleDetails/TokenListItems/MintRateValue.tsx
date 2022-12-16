import { Trans } from '@lingui/macro'
import { BigNumber } from '@ethersproject/bignumber'
import { formatIssuanceRate } from 'utils/v2v3/math'
import { formattedNum } from 'utils/format/formatNumber'

export function MintRateValue({ value }: { value: BigNumber }) {
  return (
    <Trans>
      {formattedNum(formatIssuanceRate(value.toString()))} tokens/ETH
    </Trans>
  )
}

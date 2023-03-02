import TooltipIcon from 'components/TooltipIcon'
import { BigNumber } from '@ethersproject/bignumber'
import { formatSplitPercent } from 'utils/v2v3/math'
import { Trans } from '@lingui/macro'

export function ReservedTokensValue({
  splitPercent,
  reservedRate,
}: {
  splitPercent: number
  reservedRate: number
}) {
  const splitPercentNum = parseFloat(
    formatSplitPercent(BigNumber.from(splitPercent)),
  )
  return (
    <TooltipIcon
      iconClassName="ml-2"
      tip={
        <Trans>
          {(reservedRate * splitPercentNum) / 100}% of total token issuance.
        </Trans>
      }
    />
  )
}

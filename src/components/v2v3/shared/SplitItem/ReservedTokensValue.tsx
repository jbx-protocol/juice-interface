import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { BigNumber } from 'ethers'
import { formatSplitPercent } from 'utils/v2v3/math'

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

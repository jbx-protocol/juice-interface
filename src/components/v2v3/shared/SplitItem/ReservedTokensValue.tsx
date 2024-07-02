import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { formatSplitPercent } from 'utils/v2v3/math'

export function ReservedTokensValue({
  splitPercent,
  reservedRate,
}: {
  splitPercent: number
  reservedRate: number
}) {
  const splitPercentNum = parseFloat(formatSplitPercent(BigInt(splitPercent)))
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

import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { formatSplitPercent } from 'packages/v2v3/utils/math'

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

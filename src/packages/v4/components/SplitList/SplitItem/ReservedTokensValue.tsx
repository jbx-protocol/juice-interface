import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { SplitPortion } from 'juice-sdk-core'

export function ReservedTokensValue({
  splitPercent,
  reservedRate,
}: {
  splitPercent: bigint
  reservedRate: number
}) {
  const splitPercentNum = new SplitPortion(splitPercent).toFloat()  
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

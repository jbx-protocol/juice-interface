import { Trans } from '@lingui/macro'
import TooltipIcon from 'components/TooltipIcon'
import { SplitPortion } from 'juice-sdk-core'

export function ReservedTokensValue({
  splitPercent,
  reservedPercent,
}: {
  splitPercent: SplitPortion
  reservedPercent: number
}) {
  const splitPercentNum = splitPercent.toFloat()  
  return (
    <TooltipIcon
      iconClassName="ml-2"
      tip={
        <Trans>
          {(reservedPercent * splitPercentNum) / 100}% of total token issuance.
        </Trans>
      }
    />
  )
}

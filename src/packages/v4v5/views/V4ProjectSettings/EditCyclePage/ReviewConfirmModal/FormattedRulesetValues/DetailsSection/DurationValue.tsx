import { Trans } from '@lingui/macro'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { detailedTimeString } from 'utils/format/formatTime'

export function DurationValue({
  duration,
}: {
  duration: number | undefined
}) {
  const formattedDuration = duration
    ? detailedTimeString({
        timeSeconds: duration,
        fullWords: true,
      })
    : undefined
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  return (
    <>
      {duration && duration > 0 ? (
        formattedDuration
      ) : (
        <FundingCycleDetailWarning
          showWarning={true}
          tooltipTitle={riskWarningText.duration}
        >
          <Trans>Not set</Trans>
        </FundingCycleDetailWarning>
      )}
    </>
  )
}

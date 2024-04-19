import { Trans } from '@lingui/macro'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { detailedTimeString } from 'utils/format/formatTime'

export function DurationValue({ duration }: { duration: bigint | undefined }) {
  const formattedDuration = duration
    ? detailedTimeString({
        timeSeconds: Number(duration),
        fullWords: true,
      })
    : undefined
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  return (
    <>
      {duration && duration > 0n ? (
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

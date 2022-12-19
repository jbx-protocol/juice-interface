import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { BigNumber } from '@ethersproject/bignumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { Trans } from '@lingui/macro'

export function DurationValue({
  duration,
}: {
  duration: BigNumber | undefined
}) {
  const formattedDuration = duration
    ? detailedTimeString({
        timeSeconds: duration.toNumber(),
        fullWords: true,
      })
    : undefined
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  return (
    <>
      {duration?.gt(0) ? (
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

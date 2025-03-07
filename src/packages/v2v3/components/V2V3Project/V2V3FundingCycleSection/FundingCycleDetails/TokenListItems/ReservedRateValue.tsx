import { BigNumber } from '@ethersproject/bignumber'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { formatReservedRate } from 'packages/v2v3/utils/math'

export function ReservedRateValue({
  value,
  showWarning,
}: {
  value: BigNumber
  showWarning?: boolean
}) {
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  return (
    <FundingCycleDetailWarning
      showWarning={showWarning}
      tooltipTitle={riskWarningText.metadataReservedRate}
    >
      {formatReservedRate(value)}%
    </FundingCycleDetailWarning>
  )
}

import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { AllowedValue } from './AllowedValue'

export function AllowMintingValue({ allowMinting }: { allowMinting: boolean }) {
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

  return (
    <FundingCycleDetailWarning
      showWarning={allowMinting}
      tooltipTitle={riskWarningText.allowMinting}
    >
      <AllowedValue value={allowMinting} />
    </FundingCycleDetailWarning>
  )
}

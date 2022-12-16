import { Trans } from '@lingui/macro'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'

export function AllowMintingValue({ allowMinting }: { allowMinting: boolean }) {
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()

  const allowMintingText = allowMinting ? (
    <Trans>Allowed</Trans>
  ) : (
    <Trans>Disabled</Trans>
  )

  return (
    <FundingCycleDetailWarning
      showWarning={allowMinting}
      tooltipTitle={riskWarningText.allowMinting}
    >
      {allowMintingText}
    </FundingCycleDetailWarning>
  )
}

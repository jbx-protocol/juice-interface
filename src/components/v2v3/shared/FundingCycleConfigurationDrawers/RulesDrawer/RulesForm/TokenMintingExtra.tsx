import FormItemWarningText from 'components/FormItemWarningText'
import {
  OWNER_MINTING_EXPLANATION,
  OWNER_MINTING_RISK,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'

export default function TokenMintingExtra({
  showMintingWarning,
}: {
  showMintingWarning: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      {OWNER_MINTING_EXPLANATION}
      {showMintingWarning && (
        <FormItemWarningText>{OWNER_MINTING_RISK}</FormItemWarningText>
      )}
    </div>
  )
}

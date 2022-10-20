import { t } from '@lingui/macro'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle } from '../styles'
import { useFundingConfigurationReview } from './hooks/FundingConfigurationReview'

export const MobileFundingConfigurationReview = () => {
  const {
    selection,
    allocationSplits,
    duration,
    fundingCycles,
    fundingTarget,
    payoutsText,
    setAllocationSplits,
  } = useFundingConfigurationReview()

  return (
    <>
      <DescriptionCol
        title={t`Funding cycles`}
        desc={<div style={emphasisedTextStyle()}>{fundingCycles}</div>}
      />
      <DescriptionCol
        title={t`Duration`}
        desc={
          duration ? <div style={emphasisedTextStyle()}>{duration}</div> : null
        }
      />
      <DescriptionCol
        title={t`Funding target`}
        desc={<div style={emphasisedTextStyle()}>{fundingTarget}</div>}
      />
      <DescriptionCol
        title={t`Payouts`}
        desc={<div style={emphasisedTextStyle()}>{payoutsText}</div>}
      />
      <DescriptionCol
        title={t`Payout addresses`}
        desc={
          <PayoutsList
            value={allocationSplits}
            onChange={setAllocationSplits}
            payoutsSelection={selection ?? 'amounts'}
            isEditable={false}
          />
        }
      />
    </>
  )
}

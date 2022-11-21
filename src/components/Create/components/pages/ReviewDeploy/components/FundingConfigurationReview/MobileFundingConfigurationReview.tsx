import { t } from '@lingui/macro'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { DescriptionCol } from '../DescriptionCol'
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
        desc={<div className="font-medium text-base">{fundingCycles}</div>}
      />
      <DescriptionCol
        title={t`Duration`}
        desc={
          duration ? (
            <div className="font-medium text-base">{duration}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Funding target`}
        desc={<div className="font-medium text-base">{fundingTarget}</div>}
      />
      <DescriptionCol
        title={t`Payouts`}
        desc={<div className="font-medium text-base">{payoutsText}</div>}
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

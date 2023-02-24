import { t } from '@lingui/macro'
import { PayoutsList } from '../../../TreasurySetup/components/PayoutsList'
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
    launchDate,
    setAllocationSplits,
  } = useFundingConfigurationReview()

  return (
    <>
      <DescriptionCol
        title={t`Funding cycles`}
        desc={<div className="text-base font-medium">{fundingCycles}</div>}
      />
      <DescriptionCol
        title={t`Duration`}
        desc={
          duration ? (
            <div className="text-base font-medium">{duration}</div>
          ) : null
        }
      />
      <DescriptionCol
        title={t`Scheduled launch time`}
        desc={
          <div className="text-base font-medium">
            {launchDate
              ? launchDate.utc().format('MMMM Do YYYY, h:mma z')
              : 'Immediately'}
          </div>
        }
      />
      <DescriptionCol
        title={t`Funding target`}
        desc={<div className="text-base font-medium">{fundingTarget}</div>}
      />
      <DescriptionCol
        title={t`Payouts`}
        desc={<div className="text-base font-medium">{payoutsText}</div>}
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

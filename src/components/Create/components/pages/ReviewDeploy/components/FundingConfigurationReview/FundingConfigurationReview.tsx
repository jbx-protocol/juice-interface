import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { twMerge } from 'tailwind-merge'
import { PayoutsList } from '../../../PayoutsPage/components/PayoutsList'
import { ReviewDescription } from '../ReviewDescription'
import { useFundingConfigurationReview } from './hooks/FundingConfigurationReview'

export const FundingConfigurationReview = () => {
  const {
    selection,
    allocationSplits,
    duration,
    fundingCycles,
    fundingTarget,
    setAllocationSplits,
    launchDate,
  } = useFundingConfigurationReview()

  return (
    <div className="flex flex-col gap-y-10 pt-5 pb-12 md:grid md:grid-cols-4">
      <ReviewDescription
        title={t`Funding cycles`}
        desc={<div className="text-base font-medium">{fundingCycles}</div>}
      />
      <ReviewDescription
        title={t`Duration`}
        desc={
          duration ? (
            <div className="text-base font-medium">{duration}</div>
          ) : null
        }
      />
      <ReviewDescription
        className="col-span-2"
        title={t`Scheduled launch time`}
        desc={
          <div className="text-base font-medium">
            {launchDate ? (
              <Tooltip
                title={launchDate.clone().utc().format('MMMM Do YYYY, h:mma z')}
              >
                {launchDate.clone().format('MMMM Do YYYY, h:mma z')}
              </Tooltip>
            ) : (
              <Trans>Immediately</Trans>
            )}
          </div>
        }
      />
      <ReviewDescription
        title={t`Payout`}
        desc={<div className="text-base font-medium">{fundingTarget}</div>}
      />

      <ReviewDescription
        className={twMerge(allocationSplits.length ? 'col-span-4' : '')}
        title={t`Payout addresses`}
        desc={
          allocationSplits.length > 0 ? (
            <PayoutsList
              value={allocationSplits}
              onChange={setAllocationSplits}
              payoutsSelection={selection ?? 'amounts'}
              isEditable={false}
            />
          ) : (
            <div className="text-base font-medium">
              <Trans>None</Trans>
            </div>
          )
        }
      />
    </div>
  )
}

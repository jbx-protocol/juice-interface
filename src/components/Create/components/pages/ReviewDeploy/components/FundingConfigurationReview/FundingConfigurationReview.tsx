import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { PayoutsList } from '../../../TreasurySetup/components/PayoutsList'
import { ReviewDescription } from '../DescriptionCol'
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
    <div className="flex flex-col gap-10 pt-5 pb-12">
      <>
        <div className="flex flex-col gap-y-10 md:grid md:grid-cols-4">
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
                    title={launchDate
                      .clone()
                      .utc()
                      .format('MMMM Do YYYY, h:mma z')}
                  >
                    {launchDate.clone().format('MMMM Do YYYY, h:mma z')}
                  </Tooltip>
                ) : (
                  'Immediately'
                )}
              </div>
            }
          />

          {allocationSplits.length ? (
            <ReviewDescription
              className="col-span-4"
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
          ) : (
            <ReviewDescription
              title={t`Distribution limit`}
              desc={
                <div className="text-base font-medium">{fundingTarget}</div>
              }
            />
          )}
        </div>
      </>
    </div>
  )
}

import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { CreateFlowPayoutsTable } from '../../../PayoutsPage/components/CreateFlowPayoutsTable'
import { ReviewDescription } from '../ReviewDescription'
import { useFundingConfigurationReview } from './hooks/useFundingConfigurationReview'

export const FundingConfigurationReview = () => {
  const { duration, fundingCycles, launchDate } =
    useFundingConfigurationReview()

  return (
    <>
      <div className="flex flex-col gap-y-10 pt-5 pb-12 md:grid md:grid-cols-4">
        <ReviewDescription
          title={t`Cycles`}
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
                <Trans>Immediately</Trans>
              )}
            </div>
          }
        />
      </div>
      <CreateFlowPayoutsTable addPayoutsDisabled />
    </>
  )
}

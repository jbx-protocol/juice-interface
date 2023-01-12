import { t } from '@lingui/macro'
import { Col, Row } from 'antd'
import useMobile from 'hooks/Mobile'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { DescriptionCol } from '../DescriptionCol'
import { useFundingConfigurationReview } from './hooks/FundingConfigurationReview'
import { MobileFundingConfigurationReview } from './MobileFundingConfigurationReview'

export const FundingConfigurationReview = () => {
  const isMobile = useMobile()
  const {
    selection,
    allocationSplits,
    duration,
    fundingCycles,
    fundingTarget,
    payoutsText,
    setAllocationSplits,
    launchDate,
  } = useFundingConfigurationReview()

  return (
    <div className="flex flex-col gap-10 pt-5 pb-12">
      {/* TODO: There is probably a more elegant solution to this */}
      {isMobile ? (
        <MobileFundingConfigurationReview />
      ) : (
        <>
          <Row>
            <DescriptionCol
              span={6}
              title={t`Funding cycles`}
              desc={
                <div className="text-base font-medium">{fundingCycles}</div>
              }
            />
            <DescriptionCol
              span={6}
              title={t`Duration`}
              desc={
                duration ? (
                  <div className="text-base font-medium">{duration}</div>
                ) : null
              }
            />
            <DescriptionCol
              span={6}
              title={t`Funding target`}
              desc={
                <div className="text-base font-medium">{fundingTarget}</div>
              }
            />
          </Row>
          <Row>
            <Col className="flex flex-col gap-8" span={6}>
              <DescriptionCol
                flex={1}
                title={t`Payouts`}
                desc={
                  <div className="text-base font-medium">{payoutsText}</div>
                }
              />
              <DescriptionCol
                flex={1}
                title={t`Scheduled launch time`}
                desc={
                  <div className="text-base font-medium">
                    {launchDate
                      ? launchDate.utc().format('MMMM Do YYYY, h:mma z')
                      : 'Immediately'}
                  </div>
                }
              />
            </Col>
            <DescriptionCol
              span={18}
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
          </Row>
        </>
      )}
    </div>
  )
}

import { t } from '@lingui/macro'
import { Row } from 'antd'
import useMobile from 'hooks/Mobile'
import { PayoutsList } from '../../../Payouts/components/PayoutsList'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'
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
  } = useFundingConfigurationReview()

  return (
    <div
      style={{
        ...flexColumnStyle,
        gap: '2.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      {/* TODO: There is probably a more elegant solution to this */}
      {isMobile ? (
        <MobileFundingConfigurationReview />
      ) : (
        <>
          <Row>
            <DescriptionCol
              span={6}
              title={t`Funding cycles`}
              desc={<div style={emphasisedTextStyle()}>{fundingCycles}</div>}
            />
            <DescriptionCol
              span={6}
              title={t`Duration`}
              desc={
                duration ? (
                  <div style={emphasisedTextStyle()}>{duration}</div>
                ) : null
              }
            />
            <DescriptionCol
              span={6}
              title={t`Funding target`}
              desc={<div style={emphasisedTextStyle()}>{fundingTarget}</div>}
            />
          </Row>
          <Row>
            <DescriptionCol
              span={6}
              title={t`Payouts`}
              desc={<div style={emphasisedTextStyle()}>{payoutsText}</div>}
            />
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

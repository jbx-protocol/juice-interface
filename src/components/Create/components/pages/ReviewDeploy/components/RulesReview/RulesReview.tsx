import { t } from '@lingui/macro'
import { Row } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import useMobile from 'hooks/Mobile'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle, flexColumnStyle } from '../styles'
import { useRulesReview } from './hooks/RulesReview'
import { MobileRulesReview } from './MobileRulesReview'

export const RulesReview = () => {
  const isMobile = useMobile()
  const { customAddress, pausePayments, strategy, terminalConfiguration } =
    useRulesReview()
  return (
    <div
      style={{
        ...flexColumnStyle,
        gap: '2.5rem',
        paddingTop: '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      {isMobile ? (
        <MobileRulesReview />
      ) : (
        <Row>
          <DescriptionCol
            span={6}
            title={t`Reconfiguration`}
            desc={
              <div style={emphasisedTextStyle()}>
                {strategy ? (
                  strategy
                ) : customAddress ? (
                  <FormattedAddress address={customAddress} />
                ) : (
                  '??'
                )}
              </div>
            }
          />
          <DescriptionCol
            span={6}
            title={t`Pause payments`}
            desc={<div style={emphasisedTextStyle()}>{pausePayments}</div>}
          />
          <DescriptionCol
            span={6}
            title={t`Terminal configuration`}
            desc={
              <div style={emphasisedTextStyle()}>{terminalConfiguration}</div>
            }
          />
        </Row>
      )}
    </div>
  )
}

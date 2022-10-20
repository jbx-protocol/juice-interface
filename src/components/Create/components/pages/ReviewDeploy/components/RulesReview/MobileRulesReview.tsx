import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle } from '../styles'
import { useRulesReview } from './hooks/RulesReview'

export const MobileRulesReview = () => {
  const { customAddress, pausePayments, strategy, terminalConfiguration } =
    useRulesReview()
  return (
    <>
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
        desc={<div style={emphasisedTextStyle()}>{terminalConfiguration}</div>}
      />
    </>
  )
}

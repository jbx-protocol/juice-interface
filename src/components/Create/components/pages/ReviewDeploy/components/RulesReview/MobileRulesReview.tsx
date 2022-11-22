import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { DescriptionCol } from '../DescriptionCol'
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
          <div className="text-base font-medium">
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
        desc={<div className="text-base font-medium">{pausePayments}</div>}
      />
      <DescriptionCol
        span={6}
        title={t`Terminal configuration`}
        desc={
          <div className="text-base font-medium">{terminalConfiguration}</div>
        }
      />
    </>
  )
}

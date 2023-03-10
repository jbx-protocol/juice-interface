import { t } from '@lingui/macro'
import FormattedAddress from 'components/FormattedAddress'
import { ReviewDescription } from '../DescriptionCol'
import { useRulesReview } from './hooks/RulesReview'

export const RulesReview = () => {
  const {
    customAddress,
    pausePayments,
    strategy,
    terminalConfiguration,
    controllerConfiguration,
    terminalMigration,
    controllerMigration,
    holdFees,
  } = useRulesReview()

  return (
    <div className="flex flex-col gap-y-10 pt-5 pb-8 md:grid md:grid-cols-4">
      <ReviewDescription
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
      <ReviewDescription
        title={t`Payments`}
        desc={<div className="text-base font-medium">{pausePayments}</div>}
      />
      <ReviewDescription
        className="col-span-2"
        title={t`Hold fees`}
        desc={<div className="text-base font-medium">{holdFees}</div>}
      />
      <ReviewDescription
        title={t`Terminal configuration`}
        desc={
          <div className="text-base font-medium">{terminalConfiguration}</div>
        }
      />
      <ReviewDescription
        title={t`Controller configuration`}
        desc={
          <div className="text-base font-medium">{controllerConfiguration}</div>
        }
      />
      <ReviewDescription
        title={t`Terminal migration`}
        desc={<div className="text-base font-medium">{terminalMigration}</div>}
      />
      <ReviewDescription
        title={t`Controller migration`}
        desc={
          <div className="text-base font-medium">{controllerMigration}</div>
        }
      />
    </div>
  )
}

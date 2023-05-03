import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { SetFundAccessConstraintsEvent } from 'models/subgraph-entities/v2/set-fund-access-constraints-event'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export default function SetFundAccessConstraintsEventElem({
  event,
}: {
  event:
    | Pick<
        SetFundAccessConstraintsEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'from'
        | 'distributionLimit'
        | 'distributionLimitCurrency'
      >
    | undefined
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Edited payout`}
      subject={
        <div>
          {event.distributionLimit.eq(MAX_DISTRIBUTION_LIMIT) ? (
            t`Unlimited`
          ) : (
            <AmountInCurrency
              amount={event.distributionLimit}
              currency={V2V3CurrencyName(event.distributionLimitCurrency)}
            />
          )}
        </div>
      }
    />
  )
}

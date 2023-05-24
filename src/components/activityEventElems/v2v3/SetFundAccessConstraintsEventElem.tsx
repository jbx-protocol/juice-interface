import { t } from '@lingui/macro'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { ProjectEventsQuery } from 'generated/graphql'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3CurrencyName } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

import { ActivityEvent } from '../ActivityElement'

export default function SetFundAccessConstraintsEventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['setFundAccessConstraintsEvent']
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
              currency={V2V3CurrencyName(
                event.distributionLimitCurrency as V2V3CurrencyOption,
              )}
            />
          )}
        </div>
      }
    />
  )
}

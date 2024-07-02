import { t } from '@lingui/macro'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { ProjectEventsQuery } from 'generated/graphql'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3CurrencyName } from 'utils/v2v3/currency'

import { PV_V2 } from 'constants/pv'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function SetFundAccessConstraintsEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['setFundAccessConstraintsEvent']
  withProjectLink?: boolean
}) {
  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      withProjectLink={withProjectLink}
      pv={PV_V2}
      header={t`Edited payout`}
      subject={
        <div className="font-heading text-lg">
          {isInfiniteDistributionLimit(event.distributionLimit) ? (
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

import { t } from '@lingui/macro'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { PV_V2 } from 'constants/pv'
import { ProjectEventsQuery } from 'generated/graphql'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3CurrencyName } from 'packages/v2v3/utils/currency'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
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

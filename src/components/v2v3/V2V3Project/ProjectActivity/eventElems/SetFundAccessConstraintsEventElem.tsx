import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import CurrencySymbol from 'components/CurrencySymbol'
import { SetFundAccessConstraintsEvent } from 'models/subgraph-entities/v2/set-fund-access-constraints-event'
import { formatWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName } from 'utils/v2v3/currency'

export default function SetFundAccessConstraintsEventElem({
  event,
}: {
  event:
    | Pick<
        SetFundAccessConstraintsEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
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
          <CurrencySymbol
            currency={V2V3CurrencyName(event.distributionLimitCurrency)}
          />
          {formatWad(event.distributionLimit)}
        </div>
      }
    />
  )
}

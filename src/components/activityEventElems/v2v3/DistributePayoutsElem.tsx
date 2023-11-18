import { t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import ETHAmount from 'components/currency/ETHAmount'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V2 } from 'constants/pv'
import {
  ProjectEventsQuery,
  useSplitDistributionsForDistributePayoutsEventQuery,
} from 'generated/graphql'
import { client } from 'lib/apollo/client'

import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function DistributePayoutsElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['distributePayoutsEvent']
  withProjectLink?: boolean
}) {
  // Load individual DistributeToPayoutSplit events, emitted by internal transactions of the DistributeReservedPayouts transaction
  const { data } = useSplitDistributionsForDistributePayoutsEventQuery({
    client,
    variables: {
      distributePayoutsEvent: event?.id,
    },
  })

  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Sent payouts`}
      withProjectLink={withProjectLink}
      pv={PV_V2}
      subject={
        data?.distributeToPayoutSplitEvents.length ? (
          <span className="font-heading text-lg">
            <ETHAmount amount={event.distributedAmount} />
          </span>
        ) : null
      }
      extra={
        <div>
          {data?.distributeToPayoutSplitEvents.map(e => (
            <div
              key={e.id}
              className="flex items-baseline justify-between text-sm"
            >
              <div className="font-medium">
                {e.splitProjectId ? (
                  <V2V3ProjectHandleLink
                    className="text-grey-900 dark:text-slate-100"
                    projectId={e.splitProjectId}
                  />
                ) : (
                  <JuiceboxAccountLink
                    className="text-grey-900 dark:text-slate-100"
                    address={e.beneficiary}
                  />
                )}
                :
              </div>

              <div className="text-secondary">
                <ETHAmount amount={e.amount} />
              </div>
            </div>
          ))}

          {event.beneficiaryDistributionAmount?.gt(0) && (
            <div className="flex items-baseline justify-between">
              <div>
                <EthereumAddress
                  className="text-grey-900 dark:text-slate-100"
                  address={event.beneficiary}
                />
                :
              </div>
              <div className="text-sm text-grey-500 dark:text-grey-300">
                <ETHAmount amount={event.beneficiaryDistributionAmount} />
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}

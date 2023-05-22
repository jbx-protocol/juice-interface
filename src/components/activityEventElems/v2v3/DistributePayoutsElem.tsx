import { t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import ETHAmount from 'components/currency/ETHAmount'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { ProjectEventsQuery } from 'generated/graphql'
import useSubgraphQuery from 'hooks/useSubgraphQuery'
import { ActivityEvent } from '../ActivityElement'

export default function DistributePayoutsElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['distributePayoutsEvent']
}) {
  // Load individual DistributeToPayoutSplit events, emitted by internal transactions of the DistributeReservedPayouts transaction
  const { data: distributePayoutsEvents } = useSubgraphQuery({
    entity: 'distributeToPayoutSplitEvent',
    keys: [
      'id',
      'timestamp',
      'txHash',
      'amount',
      'beneficiary',
      'splitProjectId',
    ],
    orderDirection: 'desc',
    orderBy: 'amount',
    where: event?.id
      ? {
          key: 'distributePayoutsEvent',
          value: event.id,
        }
      : undefined,
  })

  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Sent payouts`}
      subject={
        distributePayoutsEvents?.length ? (
          <span className="text-base font-medium">
            <ETHAmount amount={event.distributedAmount} />
          </span>
        ) : null
      }
      extra={
        <div>
          {distributePayoutsEvents?.map(e => (
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

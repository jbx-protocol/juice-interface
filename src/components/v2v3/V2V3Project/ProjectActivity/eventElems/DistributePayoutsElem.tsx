import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { ThemeContext } from 'contexts/themeContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { DistributePayoutsEvent } from 'models/subgraph-entities/v2/distribute-payouts-event'
import { useContext } from 'react'

export default function DistributePayoutsElem({
  event,
}: {
  event:
    | Pick<
        DistributePayoutsEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryDistributionAmount'
        | 'distributedAmount'
        | 'memo'
        | 'terminal'
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      header={t`Distributed funds`}
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
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div style={{ fontWeight: 500 }}>
                {e.splitProjectId ? (
                  <V2V3ProjectHandleLink
                    className="text-grey-900 dark:text-slate-100"
                    projectId={e.splitProjectId}
                  />
                ) : (
                  <FormattedAddress
                    className="text-grey-900 dark:text-slate-100"
                    address={e.beneficiary}
                  />
                )}
                :
              </div>

              <div style={{ color: colors.text.secondary }}>
                <ETHAmount amount={e.amount} />
              </div>
            </div>
          ))}

          {event.beneficiaryDistributionAmount?.gt(0) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div>
                <FormattedAddress
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

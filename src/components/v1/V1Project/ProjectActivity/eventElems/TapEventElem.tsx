import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'

export default function TapEventElem({
  event,
}: {
  event:
    | Pick<
        TapEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'beneficiary'
        | 'beneficiaryTransferAmount'
        | 'netTransferAmount'
      >
    | undefined
}) {
  // Load individual DistributeToPayoutMod events, emitted by internal transactions of the Tap transaction
  const { data: payoutEvents } = useSubgraphQuery(
    event?.id
      ? {
          entity: 'distributeToPayoutModEvent',
          keys: [
            'id',
            'timestamp',
            'txHash',
            'modProjectId',
            'modBeneficiary',
            'modCut',
            {
              entity: 'tapEvent',
              keys: ['id'],
            },
          ],
          orderDirection: 'desc',
          orderBy: 'modCut',
          where: {
            key: 'tapEvent',
            value: event.id,
          },
        }
      : null,
  )

  if (!event) return null

  return (
    <ActivityEvent
      event={event}
      header={t`Distributed funds`}
      subject={
        <div className="text-base font-medium text-grey-900 dark:text-slate-100">
          <ETHAmount amount={event.netTransferAmount} />
        </div>
      }
      extra={
        <div>
          {payoutEvents?.map(e => (
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
                {e.modProjectId?.gt(0) ? (
                  <span>
                    <V1ProjectHandle
                      className="text-grey-900 dark:text-slate-100"
                      projectId={e.modProjectId}
                    />
                  </span>
                ) : (
                  <FormattedAddress address={e.modBeneficiary} />
                )}
                :
              </div>

              <div className="text-grey-500 dark:text-grey-300">
                <ETHAmount amount={e.modCut} />
              </div>
            </div>
          ))}

          {event.beneficiaryTransferAmount?.gt(0) && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
              className="text-sm"
            >
              <div>
                <FormattedAddress address={event.beneficiary} />:
              </div>
              <div className="text-grey-500 dark:text-grey-300">
                <ETHAmount amount={event.beneficiaryTransferAmount} />
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}

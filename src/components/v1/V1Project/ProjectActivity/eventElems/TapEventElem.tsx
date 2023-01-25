import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedAddress from 'components/FormattedAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectLink from 'components/v2v3/shared/V2V3ProjectLink'
import { V1_V3_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { ThemeContext } from 'contexts/themeContext'
import { getAddress } from 'ethers/lib/utils'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { TapEvent } from 'models/subgraph-entities/v1/tap-event'
import { useContext } from 'react'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
            'modAllocator',
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
        <span className="text-base font-medium">
          <ETHAmount amount={event.netTransferAmount} />
        </span>
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
                {e.modProjectId > 0 ? (
                  <span>
                    {getAddress(e.modAllocator) ===
                    getAddress(V1_V3_ALLOCATOR_ADDRESS) ? (
                      <V2V3ProjectLink
                        projectId={e.modProjectId}
                        allocator={getAddress(e.modAllocator)}
                      />
                    ) : (
                      <V1ProjectHandle projectId={e.modProjectId} />
                    )}
                  </span>
                ) : (
                  <FormattedAddress address={e.modBeneficiary} />
                )}
                :
              </div>

              <div style={{ color: colors.text.secondary }}>
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
              <div style={{ fontWeight: 500 }}>
                <FormattedAddress address={event.beneficiary} />:
              </div>
              <div
                style={
                  payoutEvents?.length && payoutEvents.length > 1
                    ? { color: colors.text.secondary }
                    : { fontWeight: 500 }
                }
              >
                <ETHAmount amount={event.beneficiaryTransferAmount} />
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}

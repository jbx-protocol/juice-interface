import { t } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import EthereumAddress from 'components/EthereumAddress'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectLink from 'components/v2v3/shared/V2V3ProjectLink'
import { V1_V3_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { getAddress } from 'ethers/lib/utils'
import { ProjectEventsQuery } from 'generated/graphql'
import useSubgraphQuery from 'hooks/useSubgraphQuery'
import { isEqualAddress } from 'utils/address'

import { PV_V1 } from 'constants/pv'
import { ActivityEvent } from '../ActivityElement'

export default function TapEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['tapEvent']
  withProjectLink?: boolean
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
      header={t`Sent payouts`}
      subject={
        <span className="text-base font-medium">
          <ETHAmount amount={event.netTransferAmount} />
        </span>
      }
      withProjectLink={withProjectLink}
      pv={PV_V1}
      extra={
        <div>
          {payoutEvents?.map(e => (
            <div
              key={e.id}
              className="flex items-baseline justify-between text-sm"
            >
              <div className="font-medium">
                {e.modProjectId > 0 ? (
                  <span className="inline-flex">
                    {isEqualAddress(e.modAllocator, V1_V3_ALLOCATOR_ADDRESS) ? (
                      <V2V3ProjectLink
                        projectId={e.modProjectId}
                        allocator={getAddress(e.modAllocator)}
                      />
                    ) : (
                      <V1ProjectHandle projectId={e.modProjectId} />
                    )}
                  </span>
                ) : (
                  <EthereumAddress address={e.modBeneficiary} />
                )}
                :
              </div>

              <div className="text-secondary">
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
              <div className="font-medium">
                <EthereumAddress address={event.beneficiary} />:
              </div>
              <div>
                <ETHAmount amount={event.beneficiaryTransferAmount} />
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}

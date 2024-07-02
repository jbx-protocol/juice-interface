import { t } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import ETHAmount from 'components/currency/ETHAmount'
import { V1_V3_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { PV_V1 } from 'constants/pv'
import {
  ProjectEventsQuery,
  usePayoutModDistributionsForTapEventQuery,
} from 'generated/graphql'
import V1ProjectHandle from 'packages/v1/components/shared/V1ProjectHandle'
import V2V3ProjectLink from 'packages/v2v3/components/shared/V2V3ProjectLink'
import { isEqualAddress } from 'utils/address'

import { ethers } from 'ethers'
import { client } from 'lib/apollo/client'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function TapEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['tapEvent']
  withProjectLink?: boolean
}) {
  // Load individual DistributeToPayoutMod events, emitted by internal transactions of the Tap transaction
  const { data } = usePayoutModDistributionsForTapEventQuery({
    client,
    variables: {
      tapEvent: event?.id,
    },
  })

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
          {data?.distributeToPayoutModEvents.map(e => (
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
                        allocator={ethers.getAddress(e.modAllocator)}
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

          {event.beneficiaryTransferAmount > 0 && (
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

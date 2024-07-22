import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement/ActivityElement'
import Loading from 'components/Loading'
import { Ether, JBProjectToken } from 'juice-sdk-core'
import { NativeTokenValue, useJBContractContext, useJBTokenContext } from 'juice-sdk-react'
import {
  OrderDirection,
  PayEvent_OrderBy,
  PayEventsDocument,
  PayEventsQuery,
} from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { Address } from 'viem'

type PayEvent = {
  id: string
  amount: Ether
  beneficiary: Address
  beneficiaryTokenCount?: JBProjectToken
  timestamp: number
  txHash: string
}

function transformPayEventsRes(
  data: PayEventsQuery | undefined,
): PayEvent[] | undefined {
  return data?.payEvents.map(event => {
    return {
      id: event.id,
      amount: new Ether(BigInt(event.amount)),
      beneficiary: event.beneficiary,
      beneficiaryTokenCount: new JBProjectToken(
        // BigInt(0)
        BigInt(event.beneficiaryTokenCount),
      ),
      timestamp: event.timestamp,
      txHash: event.txHash,
    }
  })
}

export function V4ActivityList() {
  const { token } = useJBTokenContext()
  const { projectId } = useJBContractContext()
  const { data, isLoading } = useSubgraphQuery(PayEventsDocument, {
    orderBy: PayEvent_OrderBy.timestamp,
    orderDirection: OrderDirection.desc,
    where: {
      // pv: PV2,
      projectId: Number(projectId),
    },
  })

  const payEvents = transformPayEventsRes(data)

  if (!token?.data?.symbol) return null
  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-medium">Activity</h2>
      <div className="flex flex-col gap-3">
        {isLoading && <Loading />}
        {isLoading || (payEvents && payEvents.length > 0) ? (
          payEvents?.map(event => {
            return (
              <div
                className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
                key={event.id}
              >
                <ActivityEvent
                  event={{
                    ...event,
                    from: event.beneficiary,
                  }}
                  header={t`Paid`}
                  subject={
                    <span className="font-heading text-lg">
                      <NativeTokenValue wei={event.amount.value} />
                    </span>
                  }
                  extra={
                    <span>
                      bought {event.beneficiaryTokenCount?.format(6)} {token.data?.symbol}
                    </span>
                  }
                />
              </div>
            )
          })
        ) : (
          <span className="text-zinc-500 text-sm">No activity yet.</span>
        )}
      </div>
    </div>
  )
}

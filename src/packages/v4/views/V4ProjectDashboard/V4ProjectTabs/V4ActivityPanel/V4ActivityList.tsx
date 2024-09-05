import { t } from '@lingui/macro'
import Loading from 'components/Loading'
import {
  NativeTokenValue,
  useJBContractContext,
  useJBTokenContext,
} from 'juice-sdk-react'
import {
  OrderDirection,
  PayEvent_OrderBy,
  PayEventsDocument,
} from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { ActivityEvent } from './activityEventElems/ActivityElement'
import { ActivityOptions } from './ActivityOptions'
import { PayEvent } from './models/ActivityEvents'
import { transformPayEventsRes } from './utils/transformEventsData'

export function V4ActivityList() {
  const { token } = useJBTokenContext()
  const { projectId } = useJBContractContext()

  // TODO: pageSize (pagination)
  const { data: payEventsData, isLoading } = useSubgraphQuery({
    document: PayEventsDocument,
    variables: {
      orderBy: PayEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
      where: {
        projectId: Number(projectId),
      },
    },
  })

  const payEvents = transformPayEventsRes(payEventsData) ?? []

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="mb-6 font-heading text-2xl font-medium">Activity</h2>
        <ActivityOptions
          events={{
            payEvents,
            // TODO: other events
          }}
        />
      </div>
      <div className="flex flex-col gap-3">
        {isLoading && <Loading />}
        {isLoading || (payEvents && payEvents.length > 0) ? (
          payEvents?.map((event: PayEvent) => {
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
                      bought {event.beneficiaryTokenCount?.format(6)}{' '}
                      {token.data?.symbol ?? 'tokens'}
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

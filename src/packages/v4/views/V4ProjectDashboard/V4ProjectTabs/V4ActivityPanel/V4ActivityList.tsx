import Loading from 'components/Loading'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import {
  useJBContractContext,
  useReadJbTokensTokenOf
} from 'juice-sdk-react'
import {
  OrderDirection,
  PayEvent_OrderBy,
  PayEventsDocument,
  ProjectEvent,
  ProjectEvent_OrderBy
} from 'packages/v4/graphql/client/graphql'
import { useSubgraphQuery } from 'packages/v4/graphql/useSubgraphQuery'
import { AnyProjectEvent } from './activityEventElems/AnyProjectEvent'
import { ActivityOptions } from './ActivityOptions'
import { transformPayEventsRes } from './utils/transformEventsData'

export function V4ActivityList() {
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)
  const { projectId } = useJBContractContext()

  // TODO: pageSize (pagination)
  const { data: payEventsData, isLoading: payEventsLoading } = useSubgraphQuery({
    document: PayEventsDocument, 
    variables: {
      orderBy: PayEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
      where: {
        projectId: Number(projectId),
      },
    }
  })

  const { data: projectEventsData, isLoading: allEventsLoading } = useSubgraphQuery({
    document: ProjectEventsDocument, 
    variables: {
      orderBy: ProjectEvent_OrderBy.timestamp,
      orderDirection: OrderDirection.desc,
      where: {
        projectId: Number(projectId),
      },
    }
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
        {allEventsLoading && <Loading />}
        {payEventsLoading || (payEvents && payEvents.length > 0) ? (
          projectEvents?.map((event: ProjectEvent) => {
            return (
              <div
                className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
                key={event.id}
              >
                <AnyProjectEvent
                  event={event}
                  tokenSymbol={
                    // tokenSymbol should only be provided if projectEvents are restricted to a specific projectId
                    projectId === undefined ? tokenSymbol : undefined
                  }
                  withProjectLink={!projectId}
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

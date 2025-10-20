import { Button } from 'antd'
import Loading from 'components/Loading'
import { useActivityEventsQuery, useProjectQuery } from 'generated/v4v5/graphql'
import { getBendystrawClient } from 'lib/apollo/bendystrawClient'
import { translateEventDataToPresenter } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/V4V5ActivityList'
import {
  AnyEvent,
  transformEventData,
} from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import React, { useState } from 'react'
import { ActivityEvent } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/activityEventElems/ActivityElement'
import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

const PAGE_SIZE = 20
const POLL_INTERVAL = 30000 // 30 seconds

export function ProjectActivityList() {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const [endCursor, setEndCursor] = useState<string | null>(null)

  // Load the bendystraw project to get its suckerGroupId
  const { data: project } = useProjectQuery({
    client: getBendystrawClient(chainId),
    variables: {
      chainId: Number(chainId),
      projectId: Number(projectId),
      version: version
    },
    skip: !chainId || !projectId,
  })

  // Query project activity using suckerGroupId (this shows activity across all chains for this project)
  const { data: activityEvents, loading, error } = useActivityEventsQuery({
    client: getBendystrawClient(chainId),
    pollInterval: POLL_INTERVAL, // Poll every 30 seconds
    skip: !project?.project?.suckerGroupId,
    variables: {
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
      },
      orderBy: 'timestamp',
      orderDirection: 'desc',
      after: endCursor,
      limit: PAGE_SIZE,
    },
  })

  const projectEvents = React.useMemo(
    () =>
      activityEvents?.activityEvents.items
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, undefined)) ?? [],
    [activityEvents?.activityEvents.items],
  )

  return (
    <div className="flex flex-col">
      <h2 className="mb-6 font-heading text-2xl font-medium">
        Activity
      </h2>
      <div className="flex flex-col gap-3">
          {loading && <Loading />}
          {error && (
            <div className="text-red-500 text-sm">
              Error loading activity: {error.message}
            </div>
          )}
          {loading || (projectEvents && projectEvents.length > 0) ? (
            <>
              {projectEvents?.map(event => {
                if (!event?.event) return null

                return (
                  <div
                    className="border-smoke-200 pb-5 dark:border-grey-600 [&:not(:last-child)]:mb-5 [&:not(:last-child)]:border-b"
                    key={event.event.id}
                  >
                    <ActivityEvent
                      event={event.event}
                      header={event.header}
                      subject={event.subject}
                      extra={event.extra}
                    />
                  </div>
                )
              })}
              {activityEvents?.activityEvents.pageInfo.hasNextPage && (
                <Button
                  onClick={() =>
                    setEndCursor(activityEvents.activityEvents.pageInfo.endCursor)
                  }
                  className="mb-6"
                >
                  Load more
                </Button>
              )}
            </>
          ) : (
            !loading && <span className="text-zinc-500 text-sm">No activity yet.</span>
          )}
      </div>
    </div>
  )
}

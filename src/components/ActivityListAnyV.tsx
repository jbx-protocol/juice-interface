import { Trans } from '@lingui/macro'
import { Divider } from 'antd'
import Loading from 'components/Loading'
import { ProjectEventsQuery } from 'generated/graphql'
import { useActivityEventsQuery } from 'generated/v4/graphql'
import { useProjectEvents } from 'hooks/useProjectEvents'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { ActivityEvent } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/activityEventElems/ActivityElement'
import {
  AnyEvent,
  transformEventData,
} from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import { translateEventDataToPresenter } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/V4V5ActivityList'
import { useMemo } from 'react'
import { AnyProjectEvent } from './activityEventElems/AnyProjectEvent'

/**
 * Renders single list of aggregate activity data from all PVs. Auto-ordered by timestamp. No paging.
 */
export default function ActivityListAnyV({
  projectId,
  from,
  tokenSymbol,
}: {
  projectId?: number
  from?: string
  tokenSymbol?: string
}) {
  const { data: v1v2v3Activity, loading: v1v2v3Loading } = useProjectEvents({
    from,
    first: 1000,
  })

  const { data: v4Activity, loading: v4Loading } = useActivityEventsQuery({
    client: bendystrawClient,
    variables: {
      where: {
        from,
      },
      limit: 1000,
    },
  })

  const formattedV4Activity = useMemo(
    () =>
      v4Activity?.activityEvents.items
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToPresenter(e, tokenSymbol)) ?? [],
    [v4Activity?.activityEvents.items, tokenSymbol],
  )

  const isLoading = v1v2v3Loading || v4Loading

  const projectEvents = [
    ...(v1v2v3Activity?.projectEvents.map(e => ({ ...e, v4: false })) ?? []),
    ...(formattedV4Activity.map(e => ({
      ...e,
      id: e.event.id,
      v4: true,
      timestamp: e.event.timestamp,
    })) ?? []),
  ].sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))

  const count = projectEvents?.length || 0

  const list = useMemo(
    () =>
      projectEvents?.map(e => {
        let elem = null

        if (e.v4) {
          const _e = e as (typeof formattedV4Activity)[number]
          elem = (
            <ActivityEvent
              event={_e.event}
              header={_e.header}
              subject={_e.subject}
              extra={_e.extra}
            />
          )
        } else {
          elem = (
            <AnyProjectEvent
              event={e as ProjectEventsQuery['projectEvents'][number]}
              tokenSymbol={
                // tokenSymbol should only be provided if projectEvents are restricted to a specific projectId
                projectId === undefined ? tokenSymbol : undefined
              }
              withProjectLink={!projectId}
            />
          )
        }

        return (
          <div
            className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
            key={e.id}
          >
            {elem}
          </div>
        )
      }),
    [projectEvents, tokenSymbol, projectId],
  )

  const listStatus = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (count === 0 && !isLoading) {
      return (
        <>
          <Divider />
          <div className="my-5 pb-5 text-grey-500 dark:text-grey-300">
            <Trans>No activity yet</Trans>
          </div>
        </>
      )
    }

    return (
      <div className="p-2 text-center text-grey-500 dark:text-grey-300">
        <Trans>{count} total</Trans>
      </div>
    )
  }, [isLoading, count])

  return (
    <div>
      {list}

      {listStatus}
    </div>
  )
}

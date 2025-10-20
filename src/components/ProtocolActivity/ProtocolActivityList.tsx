import { Button } from 'antd'
import Loading from 'components/Loading'
import { useActivityEventsQuery } from 'generated/v4v5/graphql'
import { testnetBendystrawClient, mainnetBendystrawClient } from 'lib/apollo/bendystrawClient'
import {
  AnyEvent,
  transformEventData,
} from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import { v4v5ProjectRoute } from 'packages/v4v5/utils/routes'
import { ProtocolActivityElement } from './ProtocolActivityElement'
import { translateEventDataToProtocolPresenter } from './utils/translateEventDataToProtocolPresenter'

const PAGE_SIZE = 20
const POLL_INTERVAL = 30000 // 30 seconds

type NetworkType = 'testnet' | 'mainnet'

// Always default to mainnet first
const defaultNetwork: NetworkType = 'mainnet'

export function ProtocolActivityList() {
  const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
  const [endCursor, setEndCursor] = useState<string | null>(null)

  // Select client based on network toggle
  const client = network === 'testnet' ? testnetBendystrawClient : mainnetBendystrawClient

  // Reset cursor when network changes
  React.useEffect(() => {
    setEndCursor(null)
  }, [network])

  // Query protocol activity (no chain filter)
  const { data: activityEvents, loading, error } = useActivityEventsQuery({
    client,
    pollInterval: POLL_INTERVAL, // Poll every 30 seconds
    variables: {
      where: {},
      orderBy: 'timestamp',
      orderDirection: 'desc',
      after: endCursor,
      limit: PAGE_SIZE,
    },
  })

  const projectEvents = React.useMemo(
    () => {
      if (!activityEvents?.activityEvents.items) return []

      // Transform and present events for protocol activity
      return activityEvents.activityEvents.items
        .map(transformEventData)
        .filter((event): event is AnyEvent => !!event)
        .map(e => translateEventDataToProtocolPresenter(e))
    },
    [activityEvents?.activityEvents.items],
  )

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-6">
        <h2 className="mb-4 font-heading text-2xl font-medium">
          Protocol Activity
        </h2>
        {/* Network Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setNetwork('mainnet')}
            className={twMerge(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              network === 'mainnet'
                ? 'bg-bluebs-500 text-white'
                : 'bg-smoke-100 text-grey-600 hover:bg-smoke-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
            )}
          >
            Mainnet
          </button>
          <button
            onClick={() => setNetwork('testnet')}
            className={twMerge(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors',
              network === 'testnet'
                ? 'bg-bluebs-500 text-white'
                : 'bg-smoke-100 text-grey-600 hover:bg-smoke-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
            )}
          >
            Testnet
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6">
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

                const projectLink = event.event.projectId && event.event.chainId
                  ? v4v5ProjectRoute({
                      projectId: event.event.projectId,
                      chainId: event.event.chainId,
                      version: 5, // Default to v5 for all bendystraw projects
                    })
                  : null

                const displayName = event.event.projectName ||
                  event.event.projectHandle ||
                  `Project #${event.event.projectId}`

                return (
                  <div
                    className="border-smoke-200 pb-5 dark:border-grey-600 [&:not(:last-child)]:mb-5 [&:not(:last-child)]:border-b"
                    key={event.event.id}
                  >
                    {projectLink ? (
                      <Link
                        href={projectLink}
                        className="block cursor-pointer transition-colors hover:bg-smoke-50 dark:hover:bg-slate-800 -mx-3 px-3 py-2 rounded-lg"
                      >
                        <ProtocolActivityElement
                          event={event.event}
                          header={event.header}
                          subject={event.subject}
                          projectName={displayName}
                        />
                      </Link>
                    ) : (
                      <ProtocolActivityElement
                        event={event.event}
                        header={event.header}
                        subject={event.subject}
                        projectName={displayName}
                      />
                    )}
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
    </div>
  )
}

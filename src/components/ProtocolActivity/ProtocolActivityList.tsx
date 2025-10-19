import { Button } from 'antd'
import Loading from 'components/Loading'
import { NETWORKS, TESTNET_IDS, MAINNET_IDS } from 'constants/networks'
import { useActivityEventsQuery } from 'generated/v4v5/graphql'
import { testnetBendystrawClient, mainnetBendystrawClient } from 'lib/apollo/bendystrawClient'
import { translateEventDataToPresenter } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/V4V5ActivityList'
import {
  AnyEvent,
  transformEventData,
} from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import React, { useState, useMemo } from 'react'
import { ActivityEvent } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/activityEventElems/ActivityElement'
import { twMerge } from 'tailwind-merge'
import { ChainFilterButton } from './ChainFilterButtons'
import Link from 'next/link'
import { v4v5ProjectRoute } from 'packages/v4v5/utils/routes'

const PAGE_SIZE = 20
const POLL_INTERVAL = 30000 // 30 seconds

type NetworkType = 'testnet' | 'mainnet'

// Default to testnet if NEXT_PUBLIC_TESTNET is true, otherwise mainnet
const defaultNetwork: NetworkType = process.env.NEXT_PUBLIC_TESTNET === 'true' ? 'testnet' : 'mainnet'

export function ProtocolActivityList() {
  const [network, setNetwork] = useState<NetworkType>(defaultNetwork)
  const [selectedChainIds, setSelectedChainIds] = useState<Set<number>>(new Set())
  const [endCursor, setEndCursor] = useState<string | null>(null)

  // Select client based on network toggle
  const client = network === 'testnet' ? testnetBendystrawClient : mainnetBendystrawClient

  // Get available chains based on current network
  const availableChainIds = useMemo(() => {
    return network === 'testnet' ? Array.from(TESTNET_IDS) : Array.from(MAINNET_IDS)
  }, [network])

  // Reset cursor and chains when network changes
  React.useEffect(() => {
    setEndCursor(null)
    setSelectedChainIds(new Set())
  }, [network])

  // Reset cursor when chain selection changes
  React.useEffect(() => {
    setEndCursor(null)
  }, [selectedChainIds])

  // Toggle chain selection
  const toggleChain = (chainId: number) => {
    setSelectedChainIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chainId)) {
        newSet.delete(chainId)
      } else {
        newSet.add(chainId)
      }
      return newSet
    })
  }

  // Build query filter for selected chains
  const queryFilter = useMemo(() => {
    if (selectedChainIds.size === 0) {
      return {} // No filter, show all chains
    }
    return { chainId_in: Array.from(selectedChainIds) }
  }, [selectedChainIds])

  // Query protocol activity with optional chain filter
  const { data: activityEvents, loading, error } = useActivityEventsQuery({
    client,
    pollInterval: POLL_INTERVAL, // Poll every 30 seconds
    variables: {
      where: queryFilter,
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
    <div className="flex h-full flex-col">
      <div className="px-6 pt-6">
        <h2 className="mb-4 font-heading text-2xl font-medium">
          Protocol Activity
        </h2>
        {/* Network Toggle */}
        <div className="mb-4 flex gap-2">
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
        </div>
        {/* Chain Filter Checkboxes */}
        <div className="mb-6 flex flex-wrap gap-2">
          {availableChainIds.map(chainId => (
            <ChainFilterButton
              key={chainId}
              chainId={chainId}
              selected={selectedChainIds.has(chainId)}
              onChange={() => toggleChain(chainId)}
            />
          ))}
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
                const projectLink = event.event.projectId && event.event.chainId
                  ? v4v5ProjectRoute({
                      projectId: event.event.projectId,
                      chainId: event.event.chainId,
                      version: 5, // Default to v5 for all bendystraw projects
                    })
                  : null

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
                        <ActivityEvent
                          event={event.event}
                          header={event.header}
                          subject={event.subject}
                          extra={event.extra}
                        />
                      </Link>
                    ) : (
                      <ActivityEvent
                        event={event.event}
                        header={event.header}
                        subject={event.subject}
                        extra={event.extra}
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

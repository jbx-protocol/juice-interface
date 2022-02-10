import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import React, { useContext } from 'react'

import ActivityTabContent from './ActivityTabContent'
import TapEventElem from './TapEventElem'

export function TapActivity({ pageSize }: { pageSize: number }) {
  const { projectId } = useContext(V1ProjectContext)

  const {
    data: tapEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'tapEvent',
    keys: [
      'id',
      'netTransferAmount',
      'fundingCycleId',
      'timestamp',
      'txHash',
      'beneficiary',
      'caller',
      'beneficiaryTransferAmount',
    ],
    orderDirection: 'desc',
    orderBy: 'timestamp',
    where: projectId
      ? {
          key: 'project',
          value: projectId.toString(),
        }
      : undefined,
  })

  return (
    <ActivityTabContent
      // Add up each page's `length`
      count={tapEvents?.pages?.reduce((prev, cur) => prev + cur.length, 0) ?? 0}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isLoadingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    >
      {tapEvents?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group?.map(e => (
            <TapEventElem key={e.id} tapEvent={e} />
          ))}
        </React.Fragment>
      ))}
    </ActivityTabContent>
  )
}

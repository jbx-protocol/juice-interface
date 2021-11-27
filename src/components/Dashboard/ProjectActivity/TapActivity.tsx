import { ProjectContext } from 'contexts/projectContext'
import React, { useContext } from 'react'

import TapEventElem from './TapEventElem'
import { useInfiniteSubgraphQuery } from '../../../hooks/SubgraphQuery'
import ActivityTabContent from './ActivityTabContent'

export function TapActivity({ pageSize }: { pageSize: number }) {
  const { projectId } = useContext(ProjectContext)

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
    first: pageSize,
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

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useInfiniteSubgraphQuery } from 'hooks/SubgraphQuery'
import React, { useContext } from 'react'

import ActivityTabContent from './ActivityTabContent'
import ReservesEventElem from './ReservesEventElem'

export function ReservesActivity({ pageSize }: { pageSize: number }) {
  const { projectId } = useContext(V1ProjectContext)

  const {
    data: printReservesEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteSubgraphQuery({
    pageSize,
    entity: 'printReservesEvent',
    keys: [
      'id',
      'count',
      'beneficiary',
      'beneficiaryTicketAmount',
      'timestamp',
      'txHash',
      'caller',
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
      count={
        printReservesEvents?.pages?.reduce(
          (prev, cur) => prev + cur.length,
          0,
        ) ?? 0
      }
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isLoadingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    >
      {printReservesEvents?.pages?.map((group, i) => (
        <React.Fragment key={i}>
          {group?.map(e => (
            <ReservesEventElem key={e.id} printReservesEvent={e} />
          ))}
        </React.Fragment>
      ))}
    </ActivityTabContent>
  )
}

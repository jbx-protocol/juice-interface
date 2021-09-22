import { ProjectContext } from 'contexts/projectContext'
import {
  parsePrintReservesEventJson,
  PrintReservesEvent,
} from 'models/subgraph-entities/print-reserves-event'
import { useContext, useEffect, useMemo, useState } from 'react'
import { querySubgraph, trimHexZero } from 'utils/graph'

import ReservesEventElem from './ReservesEventElem'

export function ReservesActivity({
  pageNumber,
  pageSize,
  setLoading,
  setCount,
}: {
  pageNumber: number
  pageSize: number
  setLoading: (loading: boolean) => void
  setCount: (count: number) => void
}) {
  const [printReservesEvents, setPrintReservesEvents] = useState<
    PrintReservesEvent[]
  >([])
  const { projectId } = useContext(ProjectContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'printReservesEvent',
        keys: [
          'id',
          'count',
          'beneficiary',
          'beneficiaryTicketAmount',
          'timestamp',
          'txHash',
          'caller'
        ],
        first: pageSize,
        skip: pageNumber * pageSize,
        orderDirection: 'desc',
        orderBy: 'timestamp',
        where: projectId
          ? {
              key: 'project',
              value: trimHexZero(projectId.toHexString()),
            }
          : undefined,
      },
      res => {
        if (!res) return

        const newEvents = [...printReservesEvents]
        newEvents.push(
          ...res.printReservesEvents.map(e => parsePrintReservesEventJson(e)),
        )
        setPrintReservesEvents(newEvents)
        setLoading(false)
        setCount(newEvents.length)
      },
    )
  }, [pageNumber, pageSize, projectId])

  return useMemo(
    () => (
      <div>
        {printReservesEvents?.map(e => (
          <ReservesEventElem printReservesEvent={e} />
        ))}
      </div>
    ),
    [printReservesEvents],
  )
}

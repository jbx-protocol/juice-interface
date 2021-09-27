import { ProjectContext } from 'contexts/projectContext'
import { parseTapEventJson, TapEvent } from 'models/subgraph-entities/tap-event'
import { useContext, useEffect, useMemo, useState } from 'react'
import { querySubgraph } from 'utils/graph'

import TapEventElem from './TapEventElem'

export function TapActivity({
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
  const [tapEvents, setTapEvents] = useState<TapEvent[]>([])
  const { projectId } = useContext(ProjectContext)

  useEffect(() => {
    setLoading(true)

    querySubgraph(
      {
        entity: 'tapEvent',
        keys: [
          'netTransferAmount',
          'fundingCycleId',
          'timestamp',
          'txHash',
          'beneficiary',
          'caller',
          'beneficiaryTransferAmount',
        ],
        first: pageSize,
        skip: pageNumber * pageSize,
        orderDirection: 'desc',
        orderBy: 'timestamp',
        where: projectId
          ? {
              key: 'project',
              value: projectId.toString(),
            }
          : undefined,
      },
      res => {
        if (!res) return

        const newEvents = [...tapEvents]
        newEvents.push(...res.tapEvents.map(e => parseTapEventJson(e)))
        setTapEvents(newEvents)
        setLoading(false)
        setCount(newEvents.length)
      },
    )
  }, [pageNumber, pageSize, projectId])

  return useMemo(
    () => (
      <div>
        {tapEvents.map(e => (
          <TapEventElem tapEvent={e} />
        ))}
      </div>
    ),
    [tapEvents],
  )
}

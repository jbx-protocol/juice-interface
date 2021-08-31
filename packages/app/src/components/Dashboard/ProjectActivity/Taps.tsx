import { BigNumber } from '@ethersproject/bignumber'
import { readProvider } from 'constants/readProvider'
import { ProjectContext } from 'contexts/projectContext'
import EthDater from 'ethereum-block-by-date'
import { parseTapEventJson } from 'models/subgraph-entities/tap-event'
import moment from 'moment'
import { useContext, useEffect, useState } from 'react'
import { formatWad } from 'utils/formatNumber'
import { querySubgraph, trimHexZero } from 'utils/graph'

export default function Taps() {
  const [tapEvents, setTapEvents] = useState<
    { date: string; amount: BigNumber }[]
  >([])
  const [endTimeMillis, setEndTimeMillis] = useState<number>(moment.now())
  const [blockRefs, setBlockRefs] = useState<{ date: string; block: number }[]>(
    [],
  )
  const [blockIndex, setBlockIndex] = useState<number>(0)
  const { projectId } = useContext(ProjectContext)

  const durationMillis = 7 * 24 * 60 * 60 * 1000 // 1 week in millis

  // Get references to block every 12 hours in time window
  useEffect(() => {
    if (!endTimeMillis) return

    new EthDater(readProvider)
      .getEvery(
        'hours',
        moment(endTimeMillis - durationMillis).toISOString(),
        moment(endTimeMillis).toISOString(),
        12,
      )
      .then((res: { date: string; block: number; timestamp: number }[]) =>
        setBlockRefs(res),
      )
  }, [endTimeMillis])

  useEffect(() => {
    if (blockIndex >= blockRefs.length) return

    querySubgraph(
      {
        entity: 'tapEvent',
        keys: ['amount'],
        block: { number: blockRefs[blockIndex].block },
        where: projectId
          ? {
              key: 'id',
              value: trimHexZero(projectId.toHexString()),
            }
          : undefined,
      },
      res => {
        if (!res) return

        const newTapEvents = [...tapEvents]
        newTapEvents.push({
          date: blockRefs[blockIndex].date,
          amount:
            parseTapEventJson(res.tapEvents[0]).amount ?? BigNumber.from(0),
        })
        setTapEvents(newTapEvents)
        setBlockIndex(blockIndex + 1)
      },
    )
  }, [blockIndex, blockRefs])

  return (
    <div>
      {tapEvents.map(e => (
        <div key={e.date}>
          {e.date} - {formatWad(e.amount)}
        </div>
      ))}
    </div>
  )
}

import EthDater from 'ethereum-block-by-date'

import moment from 'moment'

import { readProvider } from 'constants/readProvider'
import { daysToMillis } from './daysToMillis'
import { BlockRef, Duration } from './types'

export const loadBlockRefs = async ({
  duration,
  now,
}: {
  duration: Duration
  now: number
}) => {
  // Get number of most recent block, and block at start of duration window
  const blockRefs = new EthDater(readProvider)
    .getEvery(
      'days',
      //TODO + 0.1 fixes bug where only one block is returned. Needs better fix
      moment(now - daysToMillis(duration + 0.1)).toISOString(),
      moment(now).toISOString(),
      duration,
      false,
    )
    .then((res: (BlockRef & { block: number })[]) => {
      const newBlockRefs: BlockRef[] = []
      const blocksCount = 40

      // Calculate intermediate block numbers at consistent intervals
      for (let i = 0; i < blocksCount; i++) {
        newBlockRefs.push({
          block: Math.round(
            ((res[1].block - res[0].block) / blocksCount) * i + res[0].block,
          ),
          timestamp: Math.round(
            ((res[1].timestamp - res[0].timestamp) / blocksCount) * i +
              res[0].timestamp,
          ),
        })
      }

      // Push blockRef for "now"
      newBlockRefs.push({
        block: null,
        timestamp: Math.round(now.valueOf() / 1000),
      })

      return newBlockRefs
      // setBlockRefs(newBlockRefs)
    })
  return blockRefs
}

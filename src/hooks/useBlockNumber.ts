import { readProvider } from 'constants/readProvider'
import { useEffect, useState } from 'react'

/**
 * Get the chain height, or a block number at a specific heigh from the chain height.
 * @param behindChainHeight Number to subtract from the chain height. If not provided, the chain height is returned.
 * @returns Block number
 */
export function useBlockNumber({
  behindChainHeight,
}: {
  behindChainHeight?: number
}) {
  const [blockNumber, setBlockNumber] = useState<number>()

  useEffect(() => {
    readProvider
      .getBlockNumber()
      .then(val => setBlockNumber(val - (behindChainHeight ?? 0)))
  }, [behindChainHeight])

  return blockNumber
}

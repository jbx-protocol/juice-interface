import { useQuery } from '@tanstack/react-query'
import { readProvider } from 'constants/readProvider'

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
  return useQuery({
    queryKey: ['blockNumber', behindChainHeight],
    queryFn: async () => {
      const blockNumber = await readProvider.getBlockNumber()
      return blockNumber - (behindChainHeight ?? 0)
    },
  })
}

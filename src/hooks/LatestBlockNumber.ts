import { readProvider } from 'constants/readProvider'
import { useEffect, useState } from 'react'

export function useLatestBlockNumber({ behind }: { behind?: number }) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()

  useEffect(() => {
    readProvider
      .getBlockNumber()
      .then(val => setLatestBlockNumber(val - (behind ?? 0)))
  }, [behind])

  return latestBlockNumber
}

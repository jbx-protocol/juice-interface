import { useState, useEffect } from 'react'

import { daysToMillis } from '../daysToMillis'
import { Duration } from '../types'

const epochToEpochMs = (epoch: number) => epoch * 1000

export const useDuration = ({
  createdAt,
  now,
}: {
  createdAt: number | undefined
  now: number
}): [
  Duration | undefined,
  React.Dispatch<React.SetStateAction<Duration | undefined>>,
] => {
  const [duration, setDuration] = useState<Duration>()

  useEffect(() => {
    if (!createdAt) return
    const createdAtMs = epochToEpochMs(createdAt)
    if (createdAtMs > now - daysToMillis(1)) {
      setDuration(1)
    } else if (createdAtMs > now - daysToMillis(7)) {
      setDuration(7)
    } else {
      setDuration(30)
    }
  }, [createdAt, now])

  return [duration, setDuration]
}

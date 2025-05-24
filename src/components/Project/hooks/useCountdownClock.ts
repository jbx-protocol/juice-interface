import { useEffect, useState } from 'react'

import { timeSecondsToDateString } from '../../../utils/timeSecondsToDateString'

/**
 * Update the remaining time every second.
 */
export const useCountdownClock = (endSeconds: number | undefined, minimal?: boolean) => {
  const [remainingTime, setRemainingTime] = useState<string>('')
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
  useEffect(() => {
    if (!endSeconds) return
    const fn = () => {
      const now = Date.now() / 1000
      const remaining = endSeconds - now > 0 ? endSeconds - now : 0
      setSecondsRemaining(remaining)
      setRemainingTime(timeSecondsToDateString(remaining, minimal ? 'minimal' : 'long'))
    }
    fn()
    const timer = setInterval(fn, 1000)
    return () => clearInterval(timer)
  }, [endSeconds, minimal])
  return { remainingTimeText: remainingTime, secondsRemaining }
}

import moment from 'moment'
import { useEffect, useState } from 'react'
import { daysToMS, minutesToMS, secondsToMS } from 'utils/units'
import { ProjectTimelineRange } from '../types'

/**
 * Calculate default range based on how old a project is.
 */
export const useTimelineRange = ({
  createdAt,
}: {
  createdAt: number | undefined
}): [
  ProjectTimelineRange,
  React.Dispatch<React.SetStateAction<ProjectTimelineRange>>,
] => {
  const [range, setRange] = useState<ProjectTimelineRange>(7)

  useEffect(() => {
    if (!createdAt) return

    // There will always be some delay in data availability, so we consider "now" to be 5 minutes ago to avoid querying data that isn't available yet.
    const nowMillis = moment.now() - minutesToMS(10)

    // Default to 30 days unless project is younger than 1 week
    if (secondsToMS(createdAt) > nowMillis - daysToMS(7)) {
      setRange(7)
    } else {
      setRange(30)
    }
  }, [createdAt])

  return [range, setRange]
}

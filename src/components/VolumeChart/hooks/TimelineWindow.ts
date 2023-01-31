import { ProjectTimelineWindow } from 'models/sepana'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { daysToMillis, minutesToMillis, secondsToMillis } from 'utils/units'

export const useTimelineWindow = ({
  createdAt,
}: {
  createdAt: number | undefined
}): [
  ProjectTimelineWindow | undefined,
  React.Dispatch<React.SetStateAction<ProjectTimelineWindow | undefined>>,
] => {
  const [window, setWindow] = useState<ProjectTimelineWindow>()

  useEffect(() => {
    if (!createdAt) return

    // There will always be a bit of a delay in data availability, so we consider "now" to be 10 minutes ago
    const nowMillis = moment.now() - minutesToMillis(10)

    // Default to 30 days unless project is younger than 1 week
    if (secondsToMillis(createdAt) > nowMillis - daysToMillis(7)) {
      setWindow(7)
    } else {
      setWindow(30)
    }
  }, [createdAt])

  return [window, setWindow]
}

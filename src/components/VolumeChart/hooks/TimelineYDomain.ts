import { ProjectTimelinePoint, ProjectTimelineType } from 'models/sepana'
import { useMemo } from 'react'

export function useTimelineYDomain(
  points: Record<keyof ProjectTimelinePoint, number>[] | undefined,
  type: ProjectTimelineType,
): [number, number] {
  return useMemo(() => {
    let max: number | undefined
    let min: number | undefined

    // Calculate domain for graph based on floor/ceiling balances
    points?.forEach(p => {
      const value = p[type]

      if (value === undefined) return

      if (min === undefined || value < min) min = value
      if (max === undefined || value > max) max = value
    })

    if (max === undefined || min === undefined) {
      return [0, 0.1]
    } else {
      const domainPad = (max - min) * 0.05
      return [Math.max(min - domainPad, 0), max + domainPad]
    }
  }, [points, type])
}

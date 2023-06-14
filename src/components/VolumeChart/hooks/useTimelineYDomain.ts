import { useMemo } from 'react'

/**
 * Calculate a Y domain based on the highest and lowest point values on a timeline
 */
export function useTimelineYDomain(
  values: number[] | undefined,
): [number, number] {
  return useMemo(() => {
    let max: number | undefined
    let min: number | undefined

    // Calculate domain for graph based on floor/ceiling balances
    values?.forEach(value => {
      if (value === undefined) return

      if (min === undefined || value < min) min = value
      if (max === undefined || value > max) max = value
    })

    if (max === undefined || min === undefined) {
      return [0, 0.1]
    } else if (min === max) {
      return [min * 0.9, max * 1.1]
    } else {
      const domainPad = (max - min) * 0.05
      return [Math.max(min - domainPad, 0), max + domainPad]
    }
  }, [values])
}

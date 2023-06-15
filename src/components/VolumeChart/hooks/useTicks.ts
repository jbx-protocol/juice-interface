import { useMemo } from 'react'

export function useTicks({
  range,
  resolution,
  offset = 0,
}: {
  range: [number, number] | undefined
  resolution: number
  offset?: number
}) {
  return useMemo(() => {
    if (!range) return []

    const ticks = []
    let [min, max] = range

    if (min === max) {
      min = min * 0.9
      max = max * 1.1
    }

    for (let i = offset; i < resolution; i++) {
      ticks.push(((max - min) / resolution) * i + min)
    }

    return ticks
  }, [range, resolution, offset])
}

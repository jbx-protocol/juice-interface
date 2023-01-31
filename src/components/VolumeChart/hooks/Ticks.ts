import { useMemo } from 'react'

export function useTicks({
  range,
  count,
}: {
  range: [number, number] | undefined
  count: number
}) {
  return useMemo(() => {
    if (!range) return []

    const ticks = []
    const [min, max] = range

    // using 0.5 places ticks a half step away from edges
    for (let i = 0.5; i < count; i++) {
      ticks.push(((max - min) / count) * i + min)
    }

    return ticks
  }, [range, count])
}

import { EventRef } from './types'

export const loadDomain = (events: EventRef[]): [number, number] => {
  let max: number | undefined
  let min: number | undefined
  // Calculate domain for graph based on floor/ceiling balances
  events.forEach(r => {
    if (r.value === undefined) return
    if (min === undefined || r.value < min) min = r.value
    if (max === undefined || r.value > max) max = r.value
  })

  if (max === undefined || min === undefined) {
    return [0, 0.1]
  } else {
    const domainPad = (max - min) * 0.05
    return [Math.max(min - domainPad, 0), Math.max(max + domainPad, 0.1)]
  }
}

import { SECONDS_IN_DAY } from 'constants/numbers'

export const secondsToMS = (secs: number) => secs * 1000

export const minutesToMS = (mins: number) => secondsToMS(mins * 60)

export const daysToMS = (days: number) => secondsToMS(days * SECONDS_IN_DAY)

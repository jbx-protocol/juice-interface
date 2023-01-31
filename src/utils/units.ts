import { SECONDS_IN_DAY } from 'constants/numbers'

export const secondsToMillis = (secs: number) => secs * 1000

export const minutesToMillis = (mins: number) => secondsToMillis(mins * 60)

export const daysToMillis = (days: number) => days * SECONDS_IN_DAY * 1000

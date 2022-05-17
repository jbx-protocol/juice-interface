import { SECONDS_IN_DAY } from 'constants/numbers'

export const daysToMillis = (days: number) => days * SECONDS_IN_DAY * 1000

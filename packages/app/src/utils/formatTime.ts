import { BigNumber } from '@ethersproject/bignumber'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'

export function secsToDays(secs?: BigNumber) {
  if (!secs || secs.lte(0)) return 0

  return parseFloat((secs.toNumber() / SECONDS_IN_DAY).toString())
}

export function detailedTimeString(secs?: BigNumber) {
  const days = secsToDays(secs)
  const hours = days && (days % 1) * 24
  const minutes = hours && (hours % 1) * 60
  const seconds = minutes && (minutes % 1) * 60

  return (
    `${days && days > 1 ? Math.floor(days).toString() + 'd ' : ''}${
      hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
    }
      ${days < 1 && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
      ${minutes < 1 && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`.trim() ||
    '--'
  )
}

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export function detailedTimeString(_days?: BigNumberish) {
  const days = BigNumber.from(_days).toNumber()

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

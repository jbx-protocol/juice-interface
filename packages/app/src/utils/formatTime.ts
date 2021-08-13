import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export function detailedTimeString(endTime?: BigNumberish) {
  const secondsLeft =
    BigNumber.from(endTime).sub(Math.floor(Date.now().valueOf())).toNumber() /
    1000

  const days = secondsLeft / 60 / 60 / 24
  const hours = (secondsLeft / 60 / 60) % 24
  const minutes = (secondsLeft / 60) % 60
  const seconds = secondsLeft % 60

  return (
    `${days && days > 1 ? Math.floor(days).toString() + 'd ' : ''}${
      hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
    }
      ${days < 1 && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
      ${minutes < 1 ? Math.floor(seconds) + 's' : ''}` || '--'
  )
}

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { SECONDS_IN_DAY } from 'constants/numbers'

export function detailedTimeString(timeSeconds?: BigNumberish) {
  const timeSecondsNumber = BigNumber.from(timeSeconds).toNumber()

  const days = Math.floor(timeSecondsNumber / 60 / 60 / 24)
  const hours = (timeSecondsNumber / 60 / 60) % 24
  const minutes = (timeSecondsNumber / 60) % 60
  const seconds = timeSecondsNumber % 60

  const daysText = `${days && days > 0 ? days.toString() + 'd ' : ''}`
  const hoursText = `${hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''}`
  const minutesText = `${
    minutes < 1 && seconds > 0 ? Math.floor(seconds) + 's' : ''
  }`

  return `${daysText}${hoursText}${minutesText}` || '--'
}

export function detailedTimeUntil(endTimeSeconds?: BigNumberish) {
  const nowSeconds = Math.floor(Date.now().valueOf() / 1000)
  const secondsLeft = Math.floor(
    BigNumber.from(endTimeSeconds).sub(Math.floor(nowSeconds)).toNumber(),
  )

  return detailedTimeString(secondsLeft)
}

export const secondsToDays = (seconds: number) => seconds / SECONDS_IN_DAY

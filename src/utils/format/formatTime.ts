import { t } from '@lingui/macro'
import { BigNumber, BigNumberish } from 'ethers'

import {
  DurationOption,
  durationOptions,
} from 'components/inputs/DurationInput'
import { SECONDS_IN_DAY, SECONDS_IN_HOUR } from 'constants/numbers'
import { DurationUnitsOption } from 'models/time'

export function detailedTimeString({
  timeSeconds,
  roundToMinutes,
  fullWords,
}: {
  timeSeconds?: BigNumberish
  roundToMinutes?: boolean
  fullWords?: boolean
}) {
  const timeSecondsNumber = BigNumber.from(timeSeconds).toNumber()

  const days = Math.floor(timeSecondsNumber / 60 / 60 / 24)
  const hours = (timeSecondsNumber / 60 / 60) % 24
  const minutes = (timeSecondsNumber / 60) % 60
  const seconds = timeSecondsNumber % 60

  const daysString = fullWords ? ' ' + t`days` + ' ' : 'd '
  const hoursString = fullWords ? ' ' + t`hours` + ' ' : 'h '
  const minutesString = fullWords ? ' ' + t`minutes` + ' ' : 'm '
  const secondsString = fullWords ? ' ' + t`seconds` : 's'

  const daysText = `${days && days > 0 ? days.toString() + daysString : ''}`
  const hoursText = `${
    hours && hours >= 1 ? Math.floor(hours) + hoursString : ''
  }`
  const minutesText = `${
    minutes && minutes >= 1 ? Math.floor(minutes) + minutesString : ''
  }`
  const secondsText = `${
    seconds && seconds > 0 && !roundToMinutes
      ? Math.floor(seconds) + secondsString
      : ''
  }`

  return `${daysText}${hoursText}${minutesText}${secondsText}`.trimEnd() || '--'
}

export function secondsUntil(timeSeconds?: BigNumberish) {
  const nowSeconds = Math.floor(Date.now().valueOf() / 1000)
  return BigNumber.from(timeSeconds).sub(Math.floor(nowSeconds)).toNumber()
}

export function detailedTimeUntil(endTimeSeconds?: BigNumberish) {
  const secondsLeft = secondsUntil(endTimeSeconds)
  return detailedTimeString({
    timeSeconds: secondsLeft,
    roundToMinutes: secondsLeft > 120,
  })
}

export const otherUnitToSeconds = ({
  duration,
  unit,
}: {
  duration: number
  unit: DurationUnitsOption
}) => {
  if (!duration) return 0
  switch (unit) {
    case 'days':
      return duration * SECONDS_IN_DAY
    case 'hours':
      return duration * SECONDS_IN_HOUR
    case 'minutes':
      return duration * 60
    default:
      return duration
  }
}

export const secondsToOtherUnit = ({
  duration,
  unit,
}: {
  duration: number
  unit: DurationUnitsOption
}) => {
  switch (unit) {
    case 'days':
      return duration / SECONDS_IN_DAY
    case 'hours':
      return duration / SECONDS_IN_HOUR
    case 'minutes':
      return duration / 60
    default:
      return duration
  }
}

export const deriveDurationUnit = (
  durationSeconds: number | undefined,
): DurationUnitsOption => {
  // Default to days
  if (!durationSeconds || durationSeconds === 0) return 'days'

  // Less that 1 min
  if (durationSeconds < 60) {
    return 'seconds'
  } else if (durationSeconds < SECONDS_IN_HOUR) {
    return 'minutes'
  } else if (durationSeconds < SECONDS_IN_DAY * 3) {
    return 'hours'
  }
  return 'days'
}

export const deriveDurationOption = (
  durationSeconds: number | undefined,
): DurationOption => {
  const _durationOptions = durationOptions()
  return (
    _durationOptions.find(
      option => option.value === deriveDurationUnit(durationSeconds),
    ) ?? _durationOptions[0]
  )
}

export const formatTime = (timestamp: BigNumber | undefined) => {
  if (timestamp === undefined) return undefined
  const timeDate = new Date(timestamp.toNumber() * 1000)
  const isoDateString = timeDate.toISOString().split('T')[0]
  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
    timeZone: 'UTC',
  }
  const timeWeekdayString = timeDate.toLocaleString('en-US', formatOptions)
  return isoDateString + ', ' + timeWeekdayString
}

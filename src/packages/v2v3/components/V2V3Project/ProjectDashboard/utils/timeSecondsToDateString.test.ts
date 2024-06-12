import { timeSecondsToDateString } from './timeSecondsToDateString'

describe('timeSecondsToDateString', () => {
  test.each([
    [0, '0d 0h 0m 0s'],
    [1, '0d 0h 0m 1s'],
    [59, '0d 0h 0m 59s'],
    [60, '0d 0h 1m 0s'],
    [61, '0d 0h 1m 1s'],
    [3599, '0d 0h 59m 59s'],
    [3600, '0d 1h 0m 0s'],
    [3601, '0d 1h 0m 1s'],
    [86399, '0d 23h 59m 59s'],
    [86400, '1d 0h 0m 0s'],
    [86401, '1d 0h 0m 1s'],
    [172799, '1d 23h 59m 59s'],
    [172800, '2d 0h 0m 0s'],
    [172801, '2d 0h 0m 1s'],
    [259199, '2d 23h 59m 59s'],
    [259200, '3d 0h 0m 0s'],
    [259201, '3d 0h 0m 1s'],
  ])(
    'timeSecondsToDateString(%i) with format = long returns %s',
    (timeInSeconds, expected) => {
      const actual = timeSecondsToDateString(timeInSeconds, 'long')
      expect(actual).toEqual(expected)
    },
  )

  test.each([
    [0, '0 Seconds'],
    [1, '1 Second'],
    [59, '59 Seconds'],
    [60, '1 Minute'],
    [61, '1 Minute'],
    [3599, '59 Minutes'],
    [3600, '1 Hour'],
    [3601, '1 Hour'],
    [86399, '23 Hours'],
    [86400, '1 Day'],
    [86401, '1 Day'],
    [172799, '1 Day'],
    [172800, '2 Days'],
    [172801, '2 Days'],
    [259199, '2 Days'],
    [259200, '3 Days'],
    [259201, '3 Days'],
  ])(
    'timeSecondsToDateString(%i) with format = short returns %s',
    (timeInSeconds, expected) => {
      const actual = timeSecondsToDateString(timeInSeconds, 'short')
      expect(actual).toEqual(expected)
    },
  )

  test.each([
    [0, '0 seconds'],
    [1, '1 second'],
    [59, '59 seconds'],
    [60, '1 minute'],
    [61, '1 minute'],
    [3599, '59 minutes'],
    [3600, '1 hour'],
    [3601, '1 hour'],
    [86399, '23 hours'],
    [86400, '1 day'],
    [86401, '1 day'],
    [172799, '1 day'],
    [172800, '2 days'],
    [172801, '2 days'],
    [259199, '2 days'],
    [259200, '3 days'],
    [259201, '3 days'],
  ])(
    'timeSecondsToDateString(%i, short, lower) returns %s',
    (timeInSeconds, expected) => {
      const actual = timeSecondsToDateString(timeInSeconds, 'short', 'lower')
      expect(actual).toEqual(expected)
    },
  )
})

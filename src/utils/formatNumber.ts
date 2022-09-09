import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { round } from 'lodash'

import { WAD_DECIMALS } from 'constants/numbers'

type FormatConfig = {
  empty?: string
  thousandsSeparator?: string
  decimalSeparator?: string
  precision?: number
  padEnd?: boolean
  decimals?: number
}

const decimalSeparator = '.'
const thousandsSeparator = ','

/**
 * Returns a Wad representation of a given [value], parsed with 18 digits.
 *
 * A wad is a decimal number with 18 digits of precision.
 * Wad: 1e-18
 * Ref: https://github.com/dapphub/ds-math
 *
 * @example
 * // returns 1000000000000000000
 * parseWad(1);
 *
 */
export const parseWad = (value?: BigNumberish) =>
  parseUnits(value?.toString() || '0', WAD_DECIMALS)

/**
 * Returns a string representation of a given [wadValue]
 *
 * A wad is a decimal number with 18 digits of precision.
 * Wad: 1e-18
 * Ref: https://github.com/dapphub/ds-math
 *
 * @example
 * // returns 1
 * fromWad(1000000000000000000);
 *
 */
export const fromWad = (wadValue?: BigNumberish) => {
  const result = formatUnits(wadValue ?? '0')
  return result.substring(result.length - 2) === '.0'
    ? result.substring(0, result.length - 2)
    : result
}

/**
 * Returns a formatted string of given [wadValue], formatted according to the given [formatConfig].
 *
 * A wad is a decimal number with 18 digits of precision.
 * Wad: 1e-18
 * Ref: https://github.com/dapphub/ds-math
 *
 * @example
 * // returns 1,000
 * formatWad(1000000000000000000000, { thousandsSeparator: ',' });
 *
 */
export const formatWad = (
  wadValue?: BigNumberish,
  formatConfig?: FormatConfig,
) => {
  if (wadValue === undefined && wadValue === null && wadValue === '') return

  let _wadValue = wadValue
  if (_wadValue?.toString().includes('.')) {
    _wadValue = _wadValue.toString().split('.')[0]
  }

  return formattedNum(fromWad(_wadValue), formatConfig)
}

/**
 * Scale a given [percentValue] to the permyriad unit by multiplying it by 100.
 *
 * Permyriad: x/10000
 *
 * Ref: https://math.fandom.com/wiki/Permyriad
 */
export const percentToPermyriad = (percentValue?: string | number) =>
  BigNumber.from(
    percentValue ? Math.floor(parseFloat(percentValue.toString()) * 100) : 0,
  )

/**
 * Scale a given [permyriadValue] to the percent unit by dividing it by 100.
 *
 * Permyriad: x/10000
 *
 * Ref: https://math.fandom.com/wiki/Permyriad
 */
export const permyriadToPercent = (permyriadValue?: BigNumberish) =>
  permyriadValue
    ? (BigNumber.from(permyriadValue).toNumber() / 100).toString()
    : '0'

/**
 * Scale a given [percentValue] to the permille unit by multiplying it by 10.
 *
 * Permille: x/1000
 *
 * Ref: https://math.fandom.com/wiki/Permille
 */
export const percentToPermille = (percentValue?: string | number) =>
  BigNumber.from(
    percentValue ? Math.floor(parseFloat(percentValue.toString()) * 10) : 0,
  )

/**
 * Scale a given [permilleValue] to the percent unit by dividing it by 10.
 *
 * Permille: x/1000
 *
 * Ref: https://math.fandom.com/wiki/Permille
 */
export const permilleToPercent = (permilleValue?: BigNumberish) =>
  permilleValue
    ? (BigNumber.from(permilleValue).toNumber() / 10).toString()
    : '0'

/**
 * Scale a given [percentValue] to the perbicent unit by multiplying it by 2.
 *
 * Perbicent: x/200
 */
export const percentToPerbicent = (percentValue?: string | number) =>
  BigNumber.from(
    percentValue ? Math.floor(parseFloat(percentValue.toString()) * 2) : 0,
  )

/**
 * Scale a given [perbicentValue] to the percent unit by dividing it by 2.
 *
 * Perbicent: x/200
 */
export const perbicentToPercent = (perbicentValue?: BigNumberish) =>
  perbicentValue
    ? (BigNumber.from(perbicentValue).toNumber() / 2).toString()
    : '0'

export const fracDiv = (quotient: string, dividend: string) => {
  return parseFloat(quotient) / parseFloat(dividend)
}

const separateThousands = (str?: string, separator = thousandsSeparator) => {
  if (!str?.trim().length) return

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

// Strips string of all commas
export const stripCommas = (string: string) => {
  return string.replace(/,/g, '')
}

export const formattedNum = (
  num: BigNumberish | undefined,
  config?: FormatConfig,
) => {
  const _empty = config?.empty ?? '0'

  if (num === undefined || num === '') return _empty

  const _thousandsSeparator = config?.thousandsSeparator ?? thousandsSeparator
  const _decimalSeparator = config?.decimalSeparator ?? decimalSeparator

  let str = num.toString()

  // Trim leading zeros
  while (str.length && str[0] === '0') {
    str = str.substring(1)
  }

  if (!str.length) return _empty

  // Round if precision specified in config
  if (config?.precision) {
    str = round(parseFloat(str), config?.precision).toString()
  }

  // Return ~0 for >0 numbers trimmed to only zeros
  function formatNearZero(formatted: string) {
    if (
      num?.toString().trim() &&
      formatted
        ?.split('')
        .filter(
          char => char !== _decimalSeparator && char !== _thousandsSeparator,
        )
        .every(char => char === '0')
    ) {
      return '~' + formatted
    }

    return formatted
  }

  if (str.includes(_decimalSeparator)) {
    const [pre, post] = str.split(_decimalSeparator)

    // Formatted preDecimal
    const formattedPre = separateThousands(pre, _thousandsSeparator) || '0'

    if (post === '0') return formatNearZero(pre)

    const formattedPost = post
      .substring(0, config?.precision ?? WAD_DECIMALS)
      .padEnd(config?.padEnd ? config?.precision ?? 0 : 0, '0')

    // If we can ignore postDecimal
    if (!formattedPost || config?.precision === 0) {
      return formatNearZero(formattedPre)
    }

    // Return entire preDecimal + postDecimal
    return formatNearZero([formattedPre, formattedPost].join(_decimalSeparator))
  }

  const formatted = separateThousands(str, _thousandsSeparator)

  return formatted
}

export const formatPercent = (
  numerator: BigNumber | undefined,
  divisor: BigNumber | undefined,
): string => {
  if (!divisor?.gt(0) || !numerator) return ''

  // Multiply by 10,000 for 4 significant figures
  const sharePct = numerator?.mul(10000).div(divisor)

  if (sharePct?.toString() === '0' && numerator?.gt(0)) {
    return '<0.01'
  }
  return (sharePct?.toNumber() / 100).toString()
}

export const truncateLongNumber = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3 - 1, symbol: 'K' },
    { value: 1e6 - 1, symbol: 'M' },
    { value: 1e9 - 1, symbol: 'B' },
    { value: 1e12 - 1, symbol: 'T' },
    { value: 1e15 - 1, symbol: 'P' },
    { value: 1e18 - 1, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0'
}

/**
Depending on [limit], either format number to human readable way or show it as exponential value in case of big numbers
*/
export const formatOrTruncate = (
  num: number,
  limit: number,
  config?: {
    truncDigits: number
    formatConfig: FormatConfig
  },
) => {
  if (num > limit) {
    return num.toExponential(config?.truncDigits || 5)
  }
  return formattedNum(num, config?.formatConfig)
}

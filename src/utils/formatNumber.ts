import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'

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

// Wad: 1e-18
export const parseWad = (amt?: BigNumberish) =>
  parseUnits(amt?.toString() || '0', WAD_DECIMALS)

export const fromWad = (
  amt?: BigNumberish,
  decimals: number = WAD_DECIMALS,
) => {
  const result = formatUnits(amt ?? '0', decimals)
  return result.substring(result.length - 2) === '.0'
    ? result.substring(0, result.length - 2)
    : result
}

export const formatWad = (amt?: BigNumberish, config?: FormatConfig) => {
  if (amt === undefined && amt === null && amt === '') return

  let _amt = amt
  if (_amt?.toString().includes('.')) {
    _amt = _amt.toString().split('.')[0]
  }

  return formattedNum(fromWad(_amt, config?.decimals), config)
}

// Strips string of all commas
export const stripCommas = (string: string) => {
  return string.replace(/,/g, '')
}

// Permyriad: x/10000
export const parsePermyriad = (amt?: string | number) =>
  BigNumber.from(amt ? Math.floor(parseFloat(amt.toString()) * 100) : 0)
export const fromPermyriad = (amt?: BigNumberish) =>
  amt ? (BigNumber.from(amt).toNumber() / 100).toString() : '0'

// Permille: x/1000
export const parsePermille = (amt?: string | number) =>
  BigNumber.from(amt ? Math.floor(parseFloat(amt.toString()) * 10) : 0)
export const fromPermille = (amt?: BigNumberish) =>
  amt ? (BigNumber.from(amt).toNumber() / 10).toString() : '0'

// Perbicent: x/200
export const parsePerbicent = (amt?: string | number) =>
  BigNumber.from(amt ? Math.floor(parseFloat(amt.toString()) * 2) : 0)
export const fromPerbicent = (amt?: BigNumberish) =>
  amt ? (BigNumber.from(amt).toNumber() / 2).toString() : '0'

export const fracDiv = (quotient: string, dividend: string) => {
  return parseFloat(quotient) / parseFloat(dividend)
}

const separateThousands = (str?: string, separator = thousandsSeparator) => {
  if (!str?.trim().length) return

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
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
      .substring(0, config?.precision ?? 18)
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

export const toUint256 = (num: BigNumber) =>
  '0x' + (num?.toHexString().split('x')[1] ?? '').padStart(64, '0')

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

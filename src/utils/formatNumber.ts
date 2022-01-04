import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'

import { WAD_PRECISION } from 'constants/numbers'

type FormatConfig = {
  empty?: string
  thousandsSeparator?: string
  decimalSeparator?: string
  decimals?: number
  padEnd?: boolean
}

const decimalSeparator = '.'
const thousandsSeparator = ','

// Wad: x/1e18
export const parseWad = (amt?: BigNumberish) =>
  parseUnits(amt?.toString() || '0', WAD_PRECISION)
export const fromWad = (amt?: BigNumberish) => {
  const result = formatUnits(amt ?? '0', WAD_PRECISION)
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

  return formattedNum(fromWad(_amt), config)
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
    str = str.substr(1)
  }

  if (!str.length) return _empty

  if (str.includes(_decimalSeparator)) {
    const [integer, decimal] = str.split(_decimalSeparator)

    const preDecimal = separateThousands(integer, _thousandsSeparator) || '0'

    if (decimal === '0') return preDecimal

    const postDecimal = decimal
      .substr(0, config?.decimals ?? 18)
      .padEnd(config?.padEnd ? config?.decimals ?? 0 : 0, '0')

    if (!postDecimal || config?.decimals === 0) return preDecimal

    return [preDecimal, postDecimal].join(_decimalSeparator)
  }

  return separateThousands(str, _thousandsSeparator)
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

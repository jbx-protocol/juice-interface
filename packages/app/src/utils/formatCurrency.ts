import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'

const wadPrecision = 18
const decimalSeparator = '.'
const thousandsSeparator = ','

export const parseWad = (amt?: string) => parseUnits(amt || '0', wadPrecision)
export const parsePerMille = (amt?: string) =>
  BigNumber.from(amt ? Math.floor(parseFloat(amt) * 10) : 0)

export const fromWad = (amt?: BigNumberish) => {
  const result = formatUnits(amt ?? '0', wadPrecision)
  return result.substring(result.length - 2) === '.0'
    ? result.substring(0, result.length - 2)
    : result
}
export const formatWad = (amt?: BigNumberish) =>
  amt !== undefined && amt !== null ? formattedNum(fromWad(amt)) : undefined
export const fromPerMille = (amt?: BigNumberish) =>
  amt ? (BigNumber.from(amt).toNumber() / 10).toString() : '0'

const separateThousands = (str?: string, separator = thousandsSeparator) => {
  if (!str?.trim().length) return

  return str.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

export const formattedNum = (
  num: BigNumberish | undefined,
  config?: {
    empty?: string
    thousandsSeparator?: string
    decimalSeparator?: string
  },
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
    return decimal === '0'
      ? separateThousands(integer, _thousandsSeparator) || '0'
      : [
          separateThousands(integer, _thousandsSeparator) || '0',
          decimal.substr(0, 6).padEnd(2, '0'),
        ].join(_decimalSeparator)
  }

  return separateThousands(str, _thousandsSeparator)
}

export class CurrencyUtils {
  // Define non-fractional conversion units
  usdPerEth: number | undefined = undefined
  weiPerUsd: number | undefined = undefined

  constructor(usdPerEth: number | undefined) {
    if (usdPerEth === undefined) return

    this.usdPerEth = usdPerEth
    this.weiPerUsd = Math.round((1 / usdPerEth) * 1e18)
  }

  weiToUsd = (wei: BigNumberish | undefined) => {
    if (!wei || this.weiPerUsd === undefined) return

    try {
      return BigNumber.from(wei).div(this.weiPerUsd)
    } catch (e) {
      console.log("Couldn't convert wei amount", wei.toString(), 'to USD', e)
    }
  }

  usdToWei = (usd: number | string | undefined, precision = 8) => {
    if (usd === undefined || this.usdPerEth === undefined) return
    if (usd === '') return

    try {
      return parseWad(
        (
          (typeof usd === 'string' ? parseFloat(usd) : usd) / this.usdPerEth
        ).toFixed(precision),
      )
    } catch (e) {
      console.log("Couldn't convert USD amount", usd.toString(), 'to wei', e)
    }
  }
}

export const fracDiv = (quotient: string, dividend: string) => {
  return parseFloat(quotient) / parseFloat(dividend)
}

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { CurrencyOption } from 'models/currency-option'

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
    padEnd?: number
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
          decimal.substr(0, 6).padEnd(config?.padEnd || 2, '0'),
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

  usdToWei = (amount: number | string | undefined, precision = 8) => {
    if (amount === undefined || this.usdPerEth === undefined) return
    if (amount === '') return

    try {
      return parseWad(
        (
          (typeof amount === 'string' ? parseFloat(amount) : amount) /
          this.usdPerEth
        ).toFixed(precision),
      )
    } catch (e) {
      console.log("Couldn't convert USD amount", amount.toString(), 'to wei', e)
    }
  }

  wadToCurrency = (
    amount: BigNumberish | undefined,
    targetCurrency: CurrencyOption | undefined,
    sourceCurrency: CurrencyOption | undefined,
  ) => {
    if (targetCurrency === undefined || sourceCurrency === undefined) return
    if (targetCurrency === sourceCurrency) return BigNumber.from(amount)
    if (targetCurrency === 1) return parseWad(this.weiToUsd(amount)?.toString())
    if (targetCurrency === 0 && this.usdPerEth !== undefined)
      return BigNumber.from(amount).div(this.usdPerEth)
  }
}

export const fracDiv = (quotient: string, dividend: string) => {
  return parseFloat(quotient) / parseFloat(dividend)
}

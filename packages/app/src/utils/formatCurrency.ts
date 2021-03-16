import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits, parseUnits } from '@ethersproject/units'

const wadPrecision = 18
const decimalSeparator = '.'

export const parseWad = (amt?: string) => parseUnits(amt ?? '0', wadPrecision)
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

const separateThousands = (str?: string, separator = ',') => {
  if (!str?.trim().length) return

  let output = ''
  let charPosition = 0

  for (let i = str.length - 1; i >= 0; i--) {
    output =
      charPosition > 0 && charPosition % 3 === 0
        ? str[i] + separator + output
        : str[i] + output
    charPosition++
  }

  return output
}

export const formattedNum = (num: BigNumberish | undefined, empty = '0') => {
  if (num === undefined) return empty

  const str = num.toString()

  if (!str.length) return empty

  if (str.includes(decimalSeparator)) {
    const [integer, decimal] = str.split(decimalSeparator)
    return decimal === '0'
      ? separateThousands(integer)
      : [separateThousands(integer), decimal.substr(0, 6).padEnd(2, '0')].join(
          decimalSeparator,
        )
  }

  return separateThousands(str)
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

/*
 * Formats a number (or string) to a string with a fixed number of decimals of 2.
 *
 * If no decimals are supplied, the number is rounded to the nearest integer.
 *
 * @param amount - The number to format.
 */
export const formatAmount = (amount: number | string) => {
  const a = typeof amount === 'string' ? parseFloat(amount) : amount

  if (a < 0.0001 && a !== 0) {
    return a.toExponential(2)
  } else if (a < 0.01) {
    return a.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  return a.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export function formatAmountWithScale(num: string | number): string {
  num = typeof num === 'string' ? parseFloat(num) : num
  const absNum = Math.abs(num)

  // determine scale
  const scale =
    absNum >= 1.0e9
      ? { value: 1.0e9, symbol: 'B' }
      : absNum >= 1.0e6
      ? { value: 1.0e6, symbol: 'M' }
      : absNum >= 1.0e3
      ? { value: 1.0e3, symbol: 'K' }
      : { value: 1, symbol: '' }

  return formatAmount(num / scale.value) + scale.symbol
}

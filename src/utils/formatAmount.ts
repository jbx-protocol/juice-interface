/*
 * Formats a number (or string) to a string with a fixed number of decimals of 2.
 *
 * If no decimals are supplied, the number is rounded to the nearest integer.
 *
 * @param amount - The number to format.
 */
export const formatAmount = (amount: number | string) => {
  let a = amount
  if (typeof amount === 'string') {
    a = parseFloat(amount)
  }
  return a.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

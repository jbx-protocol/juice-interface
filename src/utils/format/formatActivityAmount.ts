import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

/**
 * Format amounts for activity feeds with adaptive decimal places.
 * - Very small (< 0.01): Up to 4 decimals
 * - Small (0.01 - 1): 3 decimals
 * - Medium/Large (>= 1): 2 decimals
 * - Adds comma separators for thousands
 * @param amount - The amount to format
 * @param decimals - Number of decimals (default 18 for ETH)
 */
export function formatActivityAmount(
  amount: BigNumber | bigint | string,
  decimals: number = 18
): string {
  const num = typeof amount === 'string'
    ? parseFloat(formatUnits(amount, decimals))
    : parseFloat(formatUnits(BigNumber.from(amount), decimals))

  if (isNaN(num)) return '0'

  // Very small amounts: keep precision
  if (num < 0.01 && num > 0) {
    // Find first non-zero decimal
    const str = num.toFixed(6)
    const match = str.match(/0\.0*[1-9]/)
    if (match) {
      const zerosAfterDecimal = match[0].length - 2 // subtract "0."
      const decimals = Math.min(zerosAfterDecimal + 2, 6) // show 2 significant digits
      return num.toFixed(decimals)
    }
    return num.toFixed(4)
  }

  // Small amounts (0.01 - 1): 3 decimals
  if (num < 1) {
    return num.toFixed(3)
  }

  // Medium and large amounts (>= 1): 2 decimals with comma separators
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatted
}

import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'

// Known currency addresses to symbol mapping (lowercase addresses)
export const CURRENCY_SYMBOLS: Record<string, string> = {
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'USDC', // Base USDC
  [ETH_TOKEN_ADDRESS.toLowerCase()]: 'ETH', // Juicebox ETH token address
}

/**
 * Get currency symbol from currency address (hex string)
 */
export function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return 'ETH'
  // Normalize to lowercase for lookup
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()]
  return symbol || 'ETH'
}

/**
 * Format a currency amount with proper decimals and symbol
 * @param amount - The amount as bigint, BigNumber, or string
 * @param decimals - Token decimals (6 for USDC, 18 for ETH)
 * @param symbol - Currency symbol (USDC, ETH, etc.)
 * @returns Formatted string like "1,234.56 USDC" or "Ξ1,234.56"
 */
export function formatCurrencyAmount(
  amount: bigint | BigNumber | string,
  decimals: number,
  symbol: string,
): string {
  const amountBN = typeof amount === 'string'
    ? BigNumber.from(amount)
    : amount instanceof BigNumber
    ? amount
    : BigNumber.from(amount.toString())

  const num = parseFloat(formatUnits(amountBN, decimals))

  if (isNaN(num)) return symbol === 'ETH' ? 'Ξ0' : `0 ${symbol}`

  // Format with appropriate decimal places
  let formatted: string
  if (num < 0.01 && num > 0) {
    // Very small amounts: keep precision
    formatted = num.toFixed(Math.min(decimals, 6))
  } else if (num < 1) {
    // Small amounts (0.01 - 1): 3 decimals
    formatted = num.toFixed(3)
  } else {
    // Medium and large amounts (>= 1): 2 decimals with comma separators
    formatted = num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // ETH uses Ξ symbol, others use text
  return symbol === 'ETH' ? `Ξ${formatted}` : `${formatted} ${symbol}`
}

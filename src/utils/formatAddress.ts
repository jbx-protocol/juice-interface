const DEFAULT_TRUNCATE_TO = 6

/**
 * Truncates an ETH address to a given [truncateTo] length.
 * @example
 *  truncateEthAddress({
 *    address: '0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd,
 *    truncateTo: 4
 *  }) = '0xf0FE...abAd'
 */
export function truncateEthAddress({
  address,
  truncateTo = DEFAULT_TRUNCATE_TO,
}: {
  address: string
  truncateTo?: number
}) {
  const frontTruncate = truncateTo + 2 // account for 0x

  return (
    address.substring(0, frontTruncate) +
    '...' +
    address.substring(address.length - truncateTo, address.length)
  )
}

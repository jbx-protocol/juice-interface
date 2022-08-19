// Truncates an ETH address to specific number of characters (truncateTo)
// e.g. truncateEthAddress({
//   address: '0xf0FE43a75Ff248FD2E75D33fa1ebde71c6d1abAd,
//   truncateTo: 4
// }) = '0xf0FE...abAd'
export function truncateEthAddress({
  address,
  truncateTo,
}: {
  address: string
  truncateTo?: number
}) {
  const effectiveTruncateTo = truncateTo ?? 6
  const frontTruncate = effectiveTruncateTo + 2 // account for 0x

  return (
    address.substring(0, frontTruncate) +
    '...' +
    address.substring(address.length - effectiveTruncateTo, address.length)
  )
}

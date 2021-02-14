export const isEmptyAddress = (address?: string) => {
  if (!address || address.length < 2) return true

  for (const char of address.substring(2, address.length - 1)) {
    if (char !== '0') return false
  }

  return true
}

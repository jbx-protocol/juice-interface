export const addressExists = (address?: string) => {
  if (!address || address.length < 2) return false

  for (const char of address.substring(2, address.length - 1)) {
    if (char !== '0') return true
  }

  return false
}

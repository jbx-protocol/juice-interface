export const truncateString = (str: string, length = 50) => {
  return str.length > length ? str.substring(0, length - 1) + '...' : str
}
